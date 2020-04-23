const app = require('../../src/app');

describe('\'vehicle-loader\' service', () => {
  it('registered the service', () => {
    const service = app.service('vehicle-loader');
    expect(service).toBeTruthy();
  });
});
