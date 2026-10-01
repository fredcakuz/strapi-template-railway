'use strict';

/**
 * newsletter controller — riceve l'email dal form in home e la aggiunge alla
 * lista Brevo configurata su Secrets. La API key non lascia mai il backend.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {
  async subscribe(ctx) {
    const email = ctx.request.body?.email;

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return ctx.badRequest('Email non valida.');
    }

    const secrets = await strapi.documents('api::secret.secret').findFirst();
    const apiKey = secrets?.brevo_api_key;
    const listId = secrets?.brevo_list_id;

    if (!apiKey || !listId) {
      strapi.log.error('Newsletter: brevo_api_key o brevo_list_id non impostati su Secrets.');
      return ctx.internalServerError('Servizio newsletter non configurato.');
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          listIds: [listId],
          updateEnabled: true,
        }),
      });

      // Brevo risponde 400 "duplicate_parameter" se l'email è già in lista: va bene comunque.
      if (!response.ok && response.status !== 400) {
        const text = await response.text();
        strapi.log.error(`Newsletter: Brevo ha risposto ${response.status}: ${text}`);
        return ctx.internalServerError("Non siamo riusciti a completare l'iscrizione.");
      }

      return ctx.send({ ok: true });
    } catch (error) {
      strapi.log.error('Newsletter: errore chiamando Brevo', error);
      return ctx.internalServerError("Non siamo riusciti a completare l'iscrizione.");
    }
  },
};
