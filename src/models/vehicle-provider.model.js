// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const { DataTypes } = Sequelize;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const vehicleProvider = sequelizeClient.define('vehicle_provider', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    columns: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      },
    },
  });

  // eslint-disable-next-line no-unused-vars
  vehicleProvider.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return vehicleProvider;
};
