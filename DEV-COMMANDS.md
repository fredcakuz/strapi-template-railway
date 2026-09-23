# Development Commands (Strapi + Railway)

Guida veloce per avviare il progetto in sviluppo.

## Regola importante

- **Content Manager** (creare/pubblicare articoli, assegnare permessi, "Configure the view"): si fa **sempre direttamente sull'admin di produzione**, https://strapi-production-9480.up.railway.app/admin. Non serve nulla in locale.
- **Content-Type Builder** (nuovi campi, content-type, relazioni): si fa **solo in locale, contro il database locale** (vedi sotto). Mai con `railway run`, perché collega il locale al database di produzione e ogni modifica di schema scatta una migrazione live sui dati reali.

## 1) Setup del database locale (una tantum)

Richiede `postgresql@16` installato via Homebrew (`brew install postgresql@16`, poi `brew services start postgresql@16`).

```bash
createdb -h localhost hogo_strapi_dev
```

Il file `.env` locale (non versionato, già in `.gitignore`) deve contenere `DATABASE_PUBLIC_URL` puntato a questo database e i secret di Strapi generati a parte. Se manca, chiedi a chi ha fatto il setup iniziale o rigeneralo (vedi sezione "Rigenerare l'ambiente locale" sotto).

## 2) Avvio in sviluppo (locale, database separato)

```bash
cd "/Users/federicoriva/Lavori/WEB-DEV/Hogo/strapi-template-railway"
npm run develop
```

Al primo avvio il database è vuoto: Strapi ti chiederà di creare il primo utente admin locale. Da qui puoi usare liberamente il Content-Type Builder.

## 3) Portare le modifiche di schema in produzione

Le modifiche fatte in locale (Content-Type Builder) aggiornano i file in `src/api/**/content-types/*/schema.json` e `src/components/**/*.json`. Per farle arrivare in produzione:

```bash
git add src/api src/components
git commit -m "..."
git push origin main
```

Railway ha l'auto-deploy collegato a `main`: il push fa partire un nuovo build+deploy, e Strapi applica da solo le migrazioni (additive) al database di produzione all'avvio. Verifica poi su Settings → Users & Permissions che eventuali nuovi content-type abbiano anche `routes/controllers/services` (altrimenti non compaiono nei permessi — vedi commit "Add missing routes/controllers/services...").

## Note utili

- Se non vedi i content types in admin, fai refresh di `/admin` e, se serve, logout/login.
- Se "Configure the view" sembra non salvare: quasi sempre è cache del browser, non del backend. Prova in una finestra incognito; se lì funziona, svuota la cache/localStorage del dominio nel browser normale.
- Se vuoi riattivare i log SQL per debug temporaneo:
  - imposta `DATABASE_DEBUG=true` nelle env del servizio Strapi (o nel `.env` locale).
