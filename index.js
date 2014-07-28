'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server(8080, 'localhost');
var User = require('./models/user');

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
      reply(user);
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
    .fetch()
    .then(function(user) {
      reply(user);
    })
    .catch(function(error) {
      reply(error);
    });
  }
}, {
  path: '/api/{version}/users/{id}',
  method: 'PUT',
  handler: function() {

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
