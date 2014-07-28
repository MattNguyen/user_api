'use strict';

var BaseModel = require('./base');
var uuid = require('node-uuid');
var Joi = require('joi');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secretKey = require('../config/secret_key');

var userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  sessionKey: Joi.string().required()
});

var UserValidationError = function(message) {
  this.message = message;
  this.name = 'UserValidationError';
};

module.exports = BaseModel.extend({
  tableName: 'users',

  defaults: {
    id: uuid.v4(),
    sessionKey: crypto.randomBytes(16).toString('hex')
  },

  initialize: function() {
    this.on('saving', this.validate);
    this.on('saved', this.setSessionToken);
  },

  validate: function() {
    Joi.validate(this.attributes, userSchema, { allowUnknown: true }, function(err) {
      if (err !== null) {
        throw new UserValidationError(err.message);
      }
    });
  },

  setSessionToken: function() {
    if (this.get('id') && this.get('sessionKey')) {
      this.set('sessionToken', jwt.sign(this.pick('id', 'sessionKey'), secretKey));
    }

    return this;
  }
});
