const upload = require('./upload/upload.service.js');
const vehicleProvider = require('./vehicle-provider/vehicle-provider.service.js');
const vehicleInventory = require('./vehicle-inventory/vehicle-inventory.service.js');
const vehicleInventorySeed = require('./vehicle-inventory-seed/vehicle-inventory-seed.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(upload);
  app.configure(vehicleProvider);
  app.configure(vehicleInventory);
  app.configure(vehicleInventorySeed);
};
