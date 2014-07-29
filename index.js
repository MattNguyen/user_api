'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server(process.env.PORT, process.env.HOST);
var _ = require('lodash');
var secretKey = require('./config/secret_key');
var Redis = require('redis');
var RedisClient = Redis.createClient();

var VERSIONS = ['v1'];

var validateToken = function(token, decodedToken, callback) {
  console.log('Running validation...');
  console.log('token:', token);
  console.log('decoded:', decodedToken);

  RedisClient.hgetall(decodedToken.id, function(err, user) {
    if (user) {
      return callback(null, true, user);
    } else {
      return callback(null, false);
    }
  });
};

var rateLimiter = function(rateLimit, rateLimitKey, request, reply, callback) {
    RedisClient.llen(rateLimitKey, function(err, val) {
      if (val > rateLimit - 1) {
        return reply({error: 'Exceeded API request limit'}).code(429);
      } else {
        var multi = RedisClient.multi();
        if (RedisClient.exists(rateLimitKey)) {
          multi.rpush(rateLimitKey, rateLimitKey);
          multi.expire(rateLimitKey, 60);
          multi.exec();
        } else {
          RedisClient.rpushx(rateLimitKey, rateLimitKey);
        }

        callback(request, reply);
      }
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
      // Return error if version path does not exist
      if (_.indexOf(VERSIONS, request.params.version) === -1) {
        return reply({error: 'API version not found'}).code(404);
      }
      // Rate limit policy (requests per minute)
      var rateLimit = 2;

      // Rate limit on IP level
      var rateLimitKey = request.info.remoteAddress + '_' + request.method + '_' + request.path;

      // UserController
      var UserController = require('./controllers/' + request.params.version + '/user_controller');

      rateLimiter(rateLimit, rateLimitKey, request, reply, UserController.create);
    }
  }, {
    path: '/api/{version}/users/{id}',
    method: 'GET',
    config: { auth: 'jwt' },
    handler: function(request, reply) {
      // Return error if version path does not exist
      if (_.indexOf(VERSIONS, request.params.version) === -1) {
        return reply({error: 'API version not found'}).code(404);
      }

      // Rate limit policy (requests per minute)
      var rateLimit = 10;

      // Rate limit on sessionToken
      var rateLimitKey = request.auth.credentials.sessionToken + '_' + request.method + '_' + request.path;

      // UserController
      var UserController = require('./controllers/' + request.params.version + '/user_controller');
      rateLimiter(rateLimit, rateLimitKey, request, reply, UserController.show);
    }
  }, {
    path: '/api/{version}/users/{id}',
    method: 'PUT',
    config: { auth: 'jwt' },
    handler: function(request, reply) {
      // Return error if version path does not exist
      if (_.indexOf(VERSIONS, request.params.version) === -1) {
        return reply({error: 'API version not found'}).code(404);
      }

      // Rate limit policy (requests per minute)
      var rateLimit = 10;

      // Rate limit on sessionToken
      var rateLimitKey = request.auth.credentials.sessionToken + '_' + request.method + '_' + request.path;

      // UserController
      var UserController = require('./controllers/' + request.params.version + '/user_controller');
      rateLimiter(rateLimit, rateLimitKey, request, reply, UserController.update);
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
