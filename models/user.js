'use strict';

var BaseModel = require('./base');
var uuid = require('node-uuid');

module.exports = BaseModel.extend({
  tableName: 'users',

  defaults: {
    id: uuid.v4()
  },
});
