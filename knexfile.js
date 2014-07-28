// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'user_api_dev'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'database_migrations'
    }
  }
};
