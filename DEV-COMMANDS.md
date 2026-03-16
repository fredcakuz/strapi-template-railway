# Development Commands (Strapi + Railway)

Guida veloce per avviare il progetto in sviluppo.

## 1) Vai nella root del progetto

```bash
cd "/Users/federicoriva/Lavori/WEB-DEV/Hogo/strapi-template-railway"
```

## 2) Assicurati di essere loggato su Railway (solo se serve)

```bash
railway login
```

## 3) Assicurati di essere sul servizio Strapi

```bash
railway service Strapi
railway status
```

`railway status` deve mostrare:
- `Project: Urban-Entertainment`
- `Environment: production`
- `Service: Strapi`

## 4) Avvio development (comando principale)

```bash
railway run npm run develop
```

Quando e' tutto ok vedrai:
- `Strapi started successfully`
- URL locale: `http://127.0.0.1:1337`

## 5) Stop server

Nel terminale dove gira Strapi:
- `Ctrl + C`

## Note utili

- Se non vedi i content types in admin, fai refresh di `/admin` e, se serve, logout/login.
- Se vuoi riattivare i log SQL per debug temporaneo:
  - imposta `DATABASE_DEBUG=true` nelle env del servizio Strapi.
