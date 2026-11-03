'use strict';

const service = (strapi) => strapi.plugin('site-deploy').service('deploy');

module.exports = ({ strapi }) => ({
  async status(ctx) {
    try {
      ctx.body = await service(strapi).getStatus();
    } catch (error) {
      strapi.log.error('[site-deploy] Lettura stato fallita', error);
      ctx.throw(502, error.message);
    }
  },

  async trigger(ctx) {
    try {
      await service(strapi).trigger(ctx.state.user);
      ctx.body = { ok: true };
    } catch (error) {
      strapi.log.error('[site-deploy] Avvio build fallito', error);
      ctx.throw(502, error.message);
    }
  },
});
