const config = {
  locales: [],
};

const bootstrap = (/* app */) => {};

const register = (app) => {
  app.customFields.register({
    name: 'map-point',
    type: 'json',
    intlLabel: {
      id: 'map-point.label',
      defaultMessage: 'Punto sulla mappa',
    },
    intlDescription: {
      id: 'map-point.description',
      defaultMessage: "Clicca sulla mappa per segnare dove si trova questa città. Il punto viene usato dalla mappa d'Italia su Hogo.",
    },
    components: {
      Input: async () =>
        import('./extensions/MapPointInput').then((module) => ({
          default: module.default,
        })),
    },
  });
};

export default {
  config,
  bootstrap,
  register,
};
