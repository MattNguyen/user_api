'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server(8080, 'localhost');
var User = require('./models/user');
var _ = require('lodash');
_.str = require('underscore.string');

server.route([{
  path: '/api/{version}/users',
  method: 'POST',
  handler: function(request, reply) {
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
  }
}, {
  path: '/api/{version}/users/{id}',
  method: 'GET',
  handler: function(request, reply) {
    User.forge({id: request.params.id})
    .fetch({require: true})
    .then(function(user) {
      reply(user.pick('firstName', 'lastName', 'email', 'id'));
    })
    .catch(function(error) {
      reply(error);
    });
  }
}, {
  path: '/api/{version}/users/{id}',
  method: 'PUT',
  handler: function(request, reply) {
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
  }
}, {
  path: '/api/{version}/users/{id}',
  method: 'DELETE',
  handler: function() {

  }
}]);

server.start(function() {
  console.log('Server started @ ' + server.info.uri);
});
