'use strict';

const controller = require('./controllers/deploy');
const service = require('./services/deploy');
const routes = require('./routes');
const bootstrap = require('./bootstrap');

module.exports = {
  bootstrap,
  controllers: { deploy: controller },
  services: { deploy: service },
  routes,
};
