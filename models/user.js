'use strict';

var BaseModel = require('./base');
var uuid = require('node-uuid');
var Joi = require('joi');

var userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  firstName: Joi.string(),
  lastName: Joi.string()
});

var UserValidationError = function(message) {
  this.message = message;
  this.name = 'UserValidationError';
};

module.exports = BaseModel.extend({
  tableName: 'users',

  defaults: {
    id: uuid.v4()
  },

  initialize: function() {
    this.on('saving', this.validate);
  },

  validate: function() {
    Joi.validate(this.attributes, userSchema, { allowUnknown: true }, function(err) {
      if (err !== null) {
        throw new UserValidationError(err.message);
      }
    });
  }
});
