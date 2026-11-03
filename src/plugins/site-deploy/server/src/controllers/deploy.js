'use strict';

const { errors } = require('@strapi/utils');

const service = (strapi) => strapi.plugin('site-deploy').service('deploy');

// ApplicationError (400) arriva all'admin col suo messaggio; un errore 5xx
// verrebbe invece mascherato da Strapi come "Bad Gateway"/"Internal Server Error".
module.exports = ({ strapi }) => ({
  async status(ctx) {
    try {
      ctx.body = await service(strapi).getStatus();
    } catch (error) {
      strapi.log.error(`[site-deploy] Lettura stato fallita: ${error.message}`);
      throw new errors.ApplicationError(error.message);
    }
  },

  async trigger(ctx) {
    try {
      await service(strapi).trigger(ctx.state.user);
      ctx.body = { ok: true };
    } catch (error) {
      strapi.log.error(`[site-deploy] Avvio build fallito: ${error.message}`);
      throw new errors.ApplicationError(error.message);
    }
  },
});
