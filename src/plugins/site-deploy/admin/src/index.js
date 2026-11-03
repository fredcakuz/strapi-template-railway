import { Rocket } from '@strapi/icons';

const PLUGIN_ID = 'site-deploy';

export default {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: Rocket,
      intlLabel: { id: `${PLUGIN_ID}.menu`, defaultMessage: 'Aggiorna sito' },
      Component: () => import('./pages/HomePage'),
      permissions: [{ action: `plugin::${PLUGIN_ID}.deploy`, subject: null }],
    });

    app.registerPlugin({ id: PLUGIN_ID, name: 'Aggiorna sito' });
  },
};
