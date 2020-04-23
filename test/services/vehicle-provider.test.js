const app = require('../../src/app');

describe('\'vehicle-provider\' service', () => {
  it('registered the service', () => {
    const service = app.service('vehicle-provider');
    expect(service).toBeTruthy();
  });
});
