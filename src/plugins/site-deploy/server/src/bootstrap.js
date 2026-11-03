'use strict';

const { DEPLOY_ACTION } = require('./constants');

const EDITOR_ROLE_CODE = 'strapi-editor';
const SEED_KEY = 'editor-permission-seeded';

module.exports = async ({ strapi }) => {
  // Permesso "Aggiorna il sito": compare in Impostazioni → Ruoli → Plugin.
  // Il Super Admin lo ha di diritto.
  await strapi.service('admin::permission').actionProvider.registerMany([
    {
      section: 'plugins',
      displayName: 'Aggiorna il sito',
      uid: 'deploy',
      pluginName: 'site-deploy',
    },
  ]);

  // Al primo avvio lo diamo anche al ruolo Editor. Una volta sola: se poi qualcuno
  // lo toglie dall'interfaccia dei ruoli, non lo rimettiamo.
  const store = strapi.store({ type: 'plugin', name: 'site-deploy' });
  if (await store.get({ key: SEED_KEY })) return;

  const editorRole = await strapi.db.query('admin::role').findOne({ where: { code: EDITOR_ROLE_CODE } });
  if (!editorRole) return;

  const existing = await strapi.db
    .query('admin::permission')
    .findOne({ where: { action: DEPLOY_ACTION, role: editorRole.id } });

  if (!existing) {
    await strapi.service('admin::permission').createMany([
      { action: DEPLOY_ACTION, subject: null, properties: {}, conditions: [], role: editorRole.id },
    ]);
    strapi.log.info('[site-deploy] Permesso "Aggiorna il sito" assegnato al ruolo Editor');
  }

  await store.set({ key: SEED_KEY, value: true });
};
