'use strict';

var User = require('../../models/user');
var _ = require('lodash');
_.str = require('underscore.string');
var Redis = require('redis');
var RedisClient = Redis.createClient();

var UserController = {

  // POST /api/{version}/users
  create: function(request, reply) {
    var userProfile = {
      firstName: request.payload.first_name,
      lastName: request.payload.last_name,
      email: request.payload.email
    };

    User.forge(userProfile)
    .save()
    .then(function(user) {
      // Cache user data keyed off of ID
      RedisClient.hmset(user.get('id'), user.attributes);

      reply(user.pick('sessionToken', 'firstName', 'lastName', 'email', 'id')).code(201);
    })
    .catch(function(err) {
      reply(err);
    });
  },

  // GET /api/{version}/users/{id}
  show: function(request, reply) {
    return reply(_.pick(request.auth.credentials, ['firstName', 'lastName', 'email', 'id', 'sessionToken'])).code(200);
  },

  // PUT /api/{version}/users/{id}
  update: function(request, reply) {
    User.forge({id: request.params.id})
    .fetch({require: true})
    .then(function(user) {
      var updatedUser = _.pick(request.payload, ['first_name', 'last_name', 'email']);

      _.forIn(updatedUser, function(value, attr) {
        user.set(_.str.camelize(attr), value);
      });

      return user;
    })
    .then(function(user) {
      return user.save();
    })
    .then(function(user) {
      RedisClient.hmset(user.get('id'), user.attributes);
      return user;
    })
    .then(function(user) {
      reply(user.pick('id', 'firstName', 'lastName', 'email', 'sessionToken')).code(201);
    });
  },

  // DELETE /api/{version}/users/{id}
  destroy: function(request, reply) {
    User.forge({id: request.params.id})
    .destroy()
    .then(function() {
      RedisClient.del(request.params.id);
    })
    .then(function() {
      reply().code(204);
    })
    .catch(function(err) {
      reply(err);
    });
  }
};

module.exports = UserController;
