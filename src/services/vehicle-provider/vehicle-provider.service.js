// Initializes the `vehicle-provider` service on path `/vehicle-provider`
const { VehicleProvider } = require('./vehicle-provider.class');
const createModel = require('../../models/vehicle-provider.model');
const hooks = require('./vehicle-provider.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use('/vehicle-provider', new VehicleProvider(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('vehicle-provider');

  service.hooks(hooks);
};
