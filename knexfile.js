module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'swedendrift',
      database: 'yourtube'
    },
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  }
}
