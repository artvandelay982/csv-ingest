const app = require('../../src/app');

describe('\'vehicle-inventory\' service', () => {
  it('registered the service', () => {
    const service = app.service('vehicle-inventory');
    expect(service).toBeTruthy();
  });
});
