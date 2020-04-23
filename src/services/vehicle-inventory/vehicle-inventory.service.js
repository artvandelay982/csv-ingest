// Initializes the `vehicle-inventory` service on path `/vehicle-inventory`
const { VehicleInventory } = require('./vehicle-inventory.class');
const createModel = require('../../models/vehicle-inventory.model');
const hooks = require('./vehicle-inventory.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use('/vehicle-inventory', new VehicleInventory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('vehicle-inventory');

  service.hooks(hooks);
};
