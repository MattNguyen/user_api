var Hapi = require('hapi');
var server = new Hapi.Server(8080, 'localhost');

server.route([{
  path: '/api/{version}/users',
  method: 'POST',
  handler: function(request, reply) {

  }
}, {
  path: '/api/{version}/users/{id}',
  method: 'GET',
  handler: function(request, reply) {

  }
}, {
  path: '/api/{version}/users/{id}',
  method: 'PUT',
  handler: function(request, reply) {

  }
}, {
  path: '/api/{version}/users/{id}',
  method: 'DELETE',
  handler: function(request, reply) {

  }
}]);

server.start(function() {
  console.log('Server started @ ' + server.info.uri);
});
