/* eslint-disable no-await-in-loop */
const { CSV_PATH } = require('../../csv/generate');
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
    all: [],
    find: [],
    get: [],
    create: async (ctx) => {
      const { app, result: { providers = [] } } = ctx;

      const providerService = app.service('vehicle-provider');
      const inventoryService = app.service('vehicle-inventory');

      // create provider configs
      await providerService.create(providers);

      // load csvs into vehicle-inventory service
      for (let i = 0; i < providers.length; i += 1) {
        const { name, columns } = providers[i];
        await processCsv({ path: `${CSV_PATH}/${name}.csv`, service: inventoryService, columns });
      }
    },
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
