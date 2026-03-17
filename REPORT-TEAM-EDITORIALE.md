# Report Team Editoriale

## Obiettivo del lavoro

In queste settimane e' stato impostato un CMS editoriale su Strapi, ospitato su Railway, per rendere piu semplice e ordinata la pubblicazione di contenuti su Hogo.

L'obiettivo pratico e' dare al team editoriale uno strumento unico per:
- creare articoli in modo strutturato;
- gestire tassonomie e relazioni (autori, categorie, tag, localita');
- lavorare con media centralizzati su Cloudinary;
- mantenere qualita' e coerenza editoriale nel tempo.

## Cosa e' stato creato

### 1) Modelli editoriali (Content Types)

Sono disponibili i seguenti contenuti principali:
- `Article` (contenuto editoriale principale)
- `Author`
- `Category`
- `Tag`
- `City`
- `Region`
- `Page`

Il modello `Article` include, oltre ai campi base, anche:
- relazioni con autore, categorie, tag, citta' e regione;
- galleria immagini;
- blocchi contenuto flessibili (testo, citazione, call-to-action);
- componenti SEO e metadati di supporto.

### 2) Componenti riusabili

Sono stati creati componenti condivisi per standardizzare i contenuti:
- `shared.seo` (SEO base);
- `shared.contact_info` (contatti);
- `shared.map_location` (coordinate / posizione);
- blocchi `blocks.rich_text`, `blocks.quote`, `blocks.cta`.

Questo consente di riusare gli stessi schemi in piu contenuti senza reinventare la struttura ogni volta.

### 3) Infrastruttura e media

- Strapi e' collegato a Railway (app + database Postgres).
- Upload media configurato su Cloudinary.
- Aggiornata la policy di sicurezza (CSP) per mostrare correttamente le immagini Cloudinary in admin.

## Benefici per il team editoriale

- **Velocita' operativa**: meno passaggi manuali e meno errori di formattazione.
- **Coerenza**: struttura uguale tra articoli, utile per qualita' editoriale e front-end.
- **Scalabilita'**: nuovi contenuti e sezioni possono essere aggiunti senza rifare il modello da zero.
- **Qualita' SEO**: campi SEO integrati direttamente nel flusso di compilazione.
- **Gestione media migliore**: file su Cloudinary, separati dall'applicazione, piu adatti a un uso produttivo.

## Come usarlo nel lavoro quotidiano

Flusso consigliato:

1. Preparare le anagrafiche di base (`Author`, `Category`, `Tag`, `City`, `Region`).
2. Creare un nuovo `Article`.
3. Compilare campi principali (titolo, slug, tipo, excerpt).
4. Collegare tassonomie e relazioni (autore, categorie, tag, localita').
5. Caricare cover/galleria dalla Media Library.
6. Aggiungere blocchi contenuto (testo, quote, CTA) dove necessario.
7. Compilare i campi SEO.
8. Salvare in bozza, revisionare e pubblicare.

## Indicazioni operative

Per avviare l'ambiente di sviluppo e' disponibile la guida:
- `DEV-COMMANDS.md`

Comando principale:

```bash
railway run npm run develop
```

## Conclusione

Il setup attuale mette il team in condizione di lavorare in modo piu ordinato, veloce e coerente.
La struttura e' pronta per gestire produzione editoriale reale, con un flusso chiaro dalla bozza alla pubblicazione e con media centralizzati.
