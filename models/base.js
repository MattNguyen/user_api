var dbConfig = require('../config/database')[process.env.NODE_ENV];
var knex = require('knex')(dbConfig);
var Bookshelf = require('bookshelf')(knex);

module.exports = Bookshelf.Model.extend({
  hasTimestamps: true
});
