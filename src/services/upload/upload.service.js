const multer = require('multer');

const myService = {
  async create() {
    return { result: 'success' };
  },
};

const upload = multer({ dest: `${__dirname}/uploads`, limits: { fieldSize: Infinity } });

const hooks = require('./upload.hooks');

module.exports = (app) => {
  app.use(
    '/upload',

    upload.single('csv'),

    // another middleware, this time to
    // transfer the received file to feathers
    (req, res, next) => {
      req.feathers.file = req.file;
      next();
    }, myService,
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('upload');

  service.hooks(hooks);
};
