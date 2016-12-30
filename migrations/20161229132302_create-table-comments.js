exports.up = function(knex, Promise) {
  const query = knex.schema.createTable('comments', table => {
    table.increments('id')
    table.timestamp('dateposted')
    table.string('videoid')
    table.string('commentstring')
  })
  return query
};

exports.down = function(knex, Promise) {
  const query = knex.schema.dropTable('comments')
  return query
};
