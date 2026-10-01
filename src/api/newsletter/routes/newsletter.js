'use strict';

/**
 * newsletter router — endpoint pubblico per l'iscrizione, non legato a un content-type.
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/newsletter/subscribe',
      handler: 'newsletter.subscribe',
      config: {
        auth: false,
      },
    },
  ],
};
