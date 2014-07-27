var Hapi = require('hapi');
var server = new Hapi.Server(8080, 'localhost')

server.start(function() {
  console.log('Server started @ ' + server.info.uri)
})
