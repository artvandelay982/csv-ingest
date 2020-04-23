const app = require('../../src/app');

describe('\'vehicle-inventory-seed\' service', () => {
  it('registered the service', () => {
    const service = app.service('vehicle-inventory-seed');
    expect(service).toBeTruthy();
  });
});
