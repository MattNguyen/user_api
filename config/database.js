module.exports = databaseConfig = {
  development: {
    client: 'pg',
    connection: {
      database: 'user_api_dev'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'database_migrations'
    },
    debug: true
  },

  production: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'database_migrations'
    }
  },
};
