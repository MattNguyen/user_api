'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server(process.env.PORT, process.env.HOST);
var _ = require('lodash');

var VERSIONS = ['v1'];

// Routes
server.route([{
  path: '/api/{version}/users',
  method: 'POST',
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
  handler: function(request, reply) {
    if (_.indexOf(VERSIONS, request.params.version) === -1) {
      return reply({error: 'API version not found'}).code(404);
    }

    var UserController = require('./controllers/' + request.params.version + '/user_controller');
    UserController.destroy(request, reply);
  }
}]);

server.start(function() {
  console.log('Server started @ ' + server.info.uri);
});
