'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server(process.env.PORT, process.env.HOST);
var _ = require('lodash');
var secretKey = require('./config/secret_key');
var User = require('./models/user');

var VERSIONS = ['v1'];

var validateToken = function(token, decodedToken, callback) {
  console.log('Running validation...');
  console.log('token:', token);
  console.log('decoded:', decodedToken);

  User.forge({id: decodedToken.id})
  .fetch({require: true})
  .then(function(user) {
    return callback(null, true, user);
  })
  .catch(function() {
    return callback(null, false);
  });
};

server.pack.register(require('hapi-auth-jsonwebtoken'), function() {
  server.auth.strategy('jwt', 'jwt', { key: secretKey,  validateFunc: validateToken });

  // Routes
  server.route([{
    path: '/api/{version}/users',
    method: 'POST',
    config: { auth: false },
    handler: function(request, reply) {
      if (_.indexOf(VERSIONS, request.params.version) === -1) {
        return reply({error: 'API version not found'}).code(404);
      }

      var UserController = require('./controllers/' + request.params.version + '/user_controller');
      UserController.create(request, reply);
    }
  }, {
    path: '/api/{version}/users/{id}',
    method: 'GET',
    config: { auth: 'jwt' },
    handler: function(request, reply) {
      if (_.indexOf(VERSIONS, request.params.version) === -1) {
        return reply({error: 'API version not found'}).code(404);
      }

      var UserController = require('./controllers/' + request.params.version + '/user_controller');
      UserController.show(request, reply);
    }
  }, {
    path: '/api/{version}/users/{id}',
    method: 'PUT',
    config: { auth: 'jwt' },
    handler: function(request, reply) {
      if (_.indexOf(VERSIONS, request.params.version) === -1) {
        return reply({error: 'API version not found'}).code(404);
      }

      var UserController = require('./controllers/' + request.params.version + '/user_controller');
      UserController.update(request, reply);
    }
  }, {
    path: '/api/{version}/users/{id}',
    method: 'DELETE',
    config: { auth: 'jwt' },
    handler: function(request, reply) {
      if (_.indexOf(VERSIONS, request.params.version) === -1) {
        return reply({error: 'API version not found'}).code(404);
      }

      var UserController = require('./controllers/' + request.params.version + '/user_controller');
      UserController.destroy(request, reply);
    }
  }]);
});

server.start(function() {
  console.log('Server started @ ' + server.info.uri);
});
