// Initializes the `vehicle-inventory-seed` service on path `/vehicle-inventory-seed`
const { VehicleInventorySeed } = require('./vehicle-inventory-seed.class');
const hooks = require('./vehicle-inventory-seed.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/vehicle-inventory-seed', new VehicleInventorySeed(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('vehicle-inventory-seed');

  service.hooks(hooks);
};
