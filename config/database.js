module.exports = ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';
  const usePublicUrl = !isProduction && Boolean(env('DATABASE_PUBLIC_URL'));
  const connectionString = usePublicUrl
    ? env('DATABASE_PUBLIC_URL')
    : env('DATABASE_URL');

  return {
    connection: {
      client: 'postgres',
      connection: {
        connectionString,
        ssl: usePublicUrl ? { rejectUnauthorized: false } : false,
      },
      debug: true,
      pool: { min: 0, max: 7 },
    },
  };
};