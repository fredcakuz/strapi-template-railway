'use strict';

let timer;

// Debounce: più salvataggi ravvicinati producono un solo deploy. Rimane un
// no-op silenzioso finché GH_REPO/GH_TOKEN non sono impostati su Railway.
function triggerDeploy() {
  if (!process.env.GH_REPO || !process.env.GH_TOKEN) return;

  clearTimeout(timer);
  timer = setTimeout(() => {
    fetch(`https://api.github.com/repos/${process.env.GH_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({ event_type: 'strapi-publish' }),
    }).catch((e) => strapi.log.error('Deploy trigger failed', e));
  }, 30_000);
}

module.exports = {
  afterCreate: triggerDeploy,
  afterUpdate: triggerDeploy,
  afterDelete: triggerDeploy,
};
