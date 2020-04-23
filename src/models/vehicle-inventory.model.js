// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const { DataTypes } = Sequelize;

module.exports = (app) => {
  const sequelizeClient = app.get('sequelizeClient');
  const vehicleInventory = sequelizeClient.define('vehicle_inventory', {
    uuid: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      },
    },
  });

  // eslint-disable-next-line no-unused-vars
  vehicleInventory.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return vehicleInventory;
};
