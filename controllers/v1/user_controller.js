'use strict';

var User = require('../../models/user');
var _ = require('lodash');
_.str = require('underscore.string');

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
      reply(user.pick('firstName', 'lastName', 'email', 'id'));
    })
    .catch(function(err) {
      reply(err);
    });
  },

  // GET /api/{version}/users/{id}
  show: function(request, reply) {
    User.forge({id: request.params.id})
    .fetch({require: true})
    .then(function(user) {
      reply(user.pick('firstName', 'lastName', 'email', 'id'));
    })
    .catch(function(error) {
      reply(error);
    });
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
      reply(user.pick('id', 'firstName', 'lastName', 'email'));
    });
  },

  // DELETE /api/{version}/users/{id}
  destroy: function(request, reply) {
    User.forge({id: request.params.id})
    .destroy()
    .then(function() {
      reply('success');
    })
    .catch(function(err) {
      reply(err);
    });
  }
};

module.exports = UserController;
