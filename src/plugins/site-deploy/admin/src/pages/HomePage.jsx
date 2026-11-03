import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Badge, Box, Button, Flex, Link, Loader, Main, Typography } from '@strapi/design-system';
import { ArrowClockwise, ExternalLink, Rocket } from '@strapi/icons';
import { Layouts, useFetchClient, useNotification } from '@strapi/strapi/admin';

const POLL_MS = 10_000;
// Dopo il clic il run compare su GitHub con qualche secondo di ritardo:
// continuiamo a interrogare per un po' anche se non vediamo ancora run attivi.
const AFTER_TRIGGER_POLL_MS = 90_000;

const ACTIVE_STATUSES = ['queued', 'in_progress', 'waiting', 'requested', 'pending'];

function runBadge(run) {
  if (run.status === 'in_progress') return { label: 'In corso', bg: 'primary100', text: 'primary700' };
  if (ACTIVE_STATUSES.includes(run.status)) return { label: 'In coda', bg: 'neutral150', text: 'neutral700' };
  if (run.conclusion === 'success') return { label: 'Online', bg: 'success100', text: 'success700' };
  if (run.conclusion === 'cancelled') return { label: 'Sostituito', bg: 'neutral150', text: 'neutral600' };
  return { label: 'Errore', bg: 'danger100', text: 'danger700' };
}

const EVENT_LABELS = {
  repository_dispatch: 'da Strapi',
  push: 'modifica al codice',
  schedule: 'notturno',
  workflow_dispatch: 'manuale da GitHub',
};

function formatDate(iso) {
  return iso
    ? new Date(iso).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '—';
}

const HomePage = () => {
  const { get, post } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const triggeredAt = useRef(0);

  const loadStatus = useCallback(async () => {
    try {
      const { data } = await get('/site-deploy/status');
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message);
    }
  }, [get]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const activeRun = status?.runs.find((run) => ACTIVE_STATUSES.includes(run.status));
  const waitingForRun = Date.now() - triggeredAt.current < AFTER_TRIGGER_POLL_MS;
  const shouldPoll = Boolean(activeRun) || waitingForRun;

  useEffect(() => {
    if (!shouldPoll) return undefined;
    const timer = setInterval(loadStatus, POLL_MS);
    return () => clearInterval(timer);
  }, [shouldPoll, loadStatus]);

  const onDeploy = async () => {
    setIsTriggering(true);
    try {
      await post('/site-deploy/deploy');
      triggeredAt.current = Date.now();
      toggleNotification({
        type: 'success',
        message: "Aggiornamento avviato. Il sito sarà online in qualche minuto.",
      });
      setTimeout(loadStatus, 4000);
    } catch (err) {
      toggleNotification({
        type: 'danger',
        message: `Avvio non riuscito: ${err?.response?.data?.error?.message || err.message}`,
      });
    } finally {
      setIsTriggering(false);
    }
  };

  const lastSuccess = status?.lastSuccess;
  const hasPendingChanges =
    status?.lastContentChange && (!lastSuccess || status.lastContentChange > lastSuccess.createdAt);

  return (
    <Main>
      <Layouts.Header
        title="Aggiorna sito"
        subtitle="Ricostruisce hogo.food con i contenuti pubblicati in Strapi. Ci vogliono alcuni minuti."
        primaryAction={
          <Button
            startIcon={<Rocket />}
            onClick={onDeploy}
            loading={isTriggering}
            disabled={!status?.configured || Boolean(activeRun) || isTriggering}
          >
            Aggiorna il sito ora
          </Button>
        }
        secondaryAction={
          <Button variant="tertiary" startIcon={<ArrowClockwise />} onClick={loadStatus}>
            Ricarica stato
          </Button>
        }
      />
      <Layouts.Content>
        <Flex direction="column" alignItems="stretch" gap={4}>
          {error && (
            <Alert variant="danger" title="Impossibile leggere lo stato" closeLabel="Chiudi" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {!status && !error && <Loader>Caricamento…</Loader>}

          {status && !status.configured && (
            <Alert variant="warning" title="Non configurato" closeLabel="Chiudi">
              Mancano le variabili GH_REPO e/o GH_TOKEN sul server.
            </Alert>
          )}

          {status?.configured && (
            <Box background="neutral0" padding={6} shadow="tableShadow" hasRadius>
              <Flex direction="column" alignItems="flex-start" gap={2}>
                {activeRun ? (
                  <Typography variant="delta">Aggiornamento in corso…</Typography>
                ) : hasPendingChanges ? (
                  <Typography variant="delta" textColor="warning600">
                    Ci sono modifiche pubblicate non ancora online
                  </Typography>
                ) : (
                  <Typography variant="delta" textColor="success600">
                    Il sito è aggiornato
                  </Typography>
                )}
                <Typography variant="omega" textColor="neutral600">
                  Ultimo aggiornamento riuscito: {formatDate(lastSuccess?.createdAt)} · Ultima modifica pubblicata:{' '}
                  {formatDate(status.lastContentChange)}
                </Typography>
              </Flex>
            </Box>
          )}

          {status?.runs.length > 0 && (
            <Box background="neutral0" padding={6} shadow="tableShadow" hasRadius>
              <Typography variant="sigma" textColor="neutral600">
                Ultimi aggiornamenti
              </Typography>
              <Flex direction="column" alignItems="stretch" gap={3} paddingTop={4}>
                {status.runs.map((run) => {
                  const badge = runBadge(run);
                  return (
                    <Flex key={run.id} justifyContent="space-between" gap={4}>
                      <Flex gap={3}>
                        <Badge backgroundColor={badge.bg} textColor={badge.text}>
                          {badge.label}
                        </Badge>
                        <Typography variant="omega">{formatDate(run.createdAt)}</Typography>
                        <Typography variant="pi" textColor="neutral500">
                          {EVENT_LABELS[run.event] || run.event}
                        </Typography>
                      </Flex>
                      <Link href={run.url} isExternal endIcon={<ExternalLink />}>
                        Dettagli
                      </Link>
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          )}
        </Flex>
      </Layouts.Content>
    </Main>
  );
};

export default HomePage;
