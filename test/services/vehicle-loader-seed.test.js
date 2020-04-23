const app = require('../../src/app');

describe('\'vehicle-loader-seed\' service', () => {
  it('registered the service', () => {
    const service = app.service('vehicle-loader-seed');
    expect(service).toBeTruthy();
  });
});
