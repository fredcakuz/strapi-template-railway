'use strict';

// Il frontend Hogo è statico: lo ricostruisce e lo pubblica su Firebase il workflow
// GitHub Actions del repo frontend (deploy.yml), che parte su repository_dispatch
// "strapi-publish". Qui lo facciamo partire a mano e ne leggiamo lo stato.
//
// Variabili d'ambiente (Railway):
//   GH_REPO      owner/repo del frontend, es. "fredcakuz/Hogo"
//   GH_TOKEN     token fine-grained: Contents read/write + Actions read
//   GH_WORKFLOW  file del workflow (default "deploy.yml")

const GITHUB_API = 'https://api.github.com';
const EVENT_TYPE = 'strapi-publish';

// Content-type che non finiscono sul sito
const IGNORED_UIDS = new Set(['api::secret.secret']);

function getConfig() {
  return {
    repo: process.env.GH_REPO,
    token: process.env.GH_TOKEN,
    workflow: process.env.GH_WORKFLOW || 'deploy.yml',
  };
}

async function github(path, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body && { 'Content-Type': 'application/json' }),
    },
    body: body && JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`GitHub ${method} ${path} → ${response.status} ${detail}`.trim());
  }
  return response.status === 204 ? null : response.json();
}

function toRun(run) {
  return {
    id: run.id,
    status: run.status, // queued | in_progress | completed | waiting | requested | pending
    conclusion: run.conclusion, // success | failure | cancelled | ... (solo se completed)
    event: run.event,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    url: run.html_url,
  };
}

module.exports = ({ strapi }) => ({
  // Data dell'ultima modifica pubblicata su un qualsiasi content-type del sito.
  // Le bozze non contano; le cancellazioni non sono tracciate.
  async getLastContentChange() {
    let latest = null;

    for (const uid of Object.keys(strapi.contentTypes)) {
      if (!uid.startsWith('api::') || IGNORED_UIDS.has(uid)) continue;

      const entry = await strapi.db.query(uid).findOne({
        where: { publishedAt: { $notNull: true } },
        orderBy: { updatedAt: 'desc' },
        select: ['updatedAt'],
      });
      const updatedAt = entry?.updatedAt && new Date(entry.updatedAt).toISOString();
      if (updatedAt && (!latest || updatedAt > latest)) latest = updatedAt;
    }

    return latest;
  },

  async getStatus() {
    const { repo, token, workflow } = getConfig();
    const lastContentChange = await this.getLastContentChange();

    if (!repo || !token) {
      return { configured: false, runs: [], lastSuccess: null, lastContentChange };
    }

    const data = await github(`/repos/${repo}/actions/workflows/${workflow}/runs?per_page=10`, { token });
    const runs = data.workflow_runs.map(toRun);
    const lastSuccess = runs.find((run) => run.status === 'completed' && run.conclusion === 'success') ?? null;

    return { configured: true, runs: runs.slice(0, 5), lastSuccess, lastContentChange };
  },

  async trigger(user) {
    const { repo, token } = getConfig();
    if (!repo || !token) throw new Error('GH_REPO o GH_TOKEN non impostati');

    await github(`/repos/${repo}/dispatches`, {
      token,
      method: 'POST',
      body: { event_type: EVENT_TYPE },
    });

    const who = user ? [user.firstname, user.lastname].filter(Boolean).join(' ') || user.email : 'sconosciuto';
    strapi.log.info(`[site-deploy] Aggiornamento sito avviato da ${who}`);
  },
});
