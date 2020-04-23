// REST service to seed provider/inventory data
/* eslint-disable class-methods-use-this */
const { generate } = require('../../csv/generate');


/* eslint-disable no-unused-vars */
exports.VehicleInventorySeed = class VehicleInventorySeed {
  constructor(options) {
    this.options = options || {};
  }

  async create(data, params) {
    const { query: { numRows = 0, numCsvs = 0 } } = params;
    let providers = [];
    if (numRows < 1 || numCsvs < 1) return { success: true, providers };
    providers = await generate(numCsvs, numRows);

    return { success: true, providers };
  }
};
