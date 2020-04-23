const processCsv = require('../../csv/processCsv');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    // after csv is uploaded, process and add vehicle data to the vehicle-inventory service
    create: async (ctx) => {
      const {
        app,
        params: {
          file: { path },
          query: { providerName: name = '' },
        },
      } = ctx;

      const vehicleInventory = app.service('vehicle-inventory');
      const vehicleProvider = app.service('vehicle-provider');

      // find the provider for this csv
      const provider = await vehicleProvider.find({ query: { name } });
      if (!provider || !provider.data || !provider.data.length) throw new Error('Provider not found.');

      // parse json config from jsonb columns info
      let { columns } = provider.data[0];
      try {
        columns = JSON.parse(columns);
      } catch (error) {
        throw new Error('Error parsing provider config. Please update it.');
      }

      // add new vehicles, update existing vehicles
      // long running jobs like processing large csv files
      //  should be moved to a job queue (eventually)
      await processCsv({ path, service: vehicleInventory, columns });
    },

    all: [],
    find: [],
    get: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
