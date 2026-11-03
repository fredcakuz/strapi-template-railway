'use strict';

const { DEPLOY_ACTION } = require('../constants');

// Rotte "admin": solo utenti dell'admin con il permesso "Aggiorna il sito"
// (Super Admin ed Editor, vedi bootstrap.js).
const policies = [
  'admin::isAuthenticatedAdmin',
  { name: 'admin::hasPermissions', config: { actions: [DEPLOY_ACTION] } },
];

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/status',
        handler: 'deploy.status',
        config: { policies },
      },
      {
        method: 'POST',
        path: '/deploy',
        handler: 'deploy.trigger',
        config: { policies },
      },
    ],
  },
};
