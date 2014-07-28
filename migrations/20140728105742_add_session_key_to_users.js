'use strict';

exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('session_key');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('session_key');
  });
};
