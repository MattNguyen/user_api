'use strict';

exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('session_token', 300);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('session_token');
  });
};
