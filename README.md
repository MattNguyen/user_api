User API written in Hapi
-----------

### Technologies
* Hapi
* PostgreSQL
* Redis

### Local Development Setup
1. Create user_api_dev database in PostgreSQL

```
$ psql

psql (9.1.4)
type "help" for help.

user=# CREATE DATABASE user_api_dev;
```

2. `$ knex migrate:latest`
3. `$ gulp dev`

### API Reference

#### User

##### POST /api/v1/users

Creates a new user with a sessionToken to be passed as an Authorization header with each subsequent request.

For example,

`Authorization: Bearer <sessionToken>`

*Authentication required:* false

*API Limit:* 2

*Params:*
* email (required)
* first_name
* last_name

*Response:*
* id
* email
* firstName
* lastName
* sessionToken

##### GET /api/v1/users/{id}

Retrieves a user with id.

*Authentication required:* false

*API Limit:* 10

*Params:*
* id

*Response:*
* id
* email
* firstName
* lastName
* sessionToken

##### PUT /api/v1/users/{id}

Updates a user at id.

*Authentication required:* false

*API Limit:* 10

*Params:*
* email
* first_name
* last_name

*Response:*
* id
* email
* firstName
* lastName
* sessionToken

##### DELETE /api/v1/users/{id}

Deletes a user at id.

*Authentication required:* false

*API Limit:* None

*Params:*
* id

*Response:*
(none)

### Notes
* This API showcases simple implementations for rate limiting and authentication, though the application may be incorrect. For example, using JSON web tokens as sessionTokens here implies user level authentication. However, any request with a valid sessionKey is given access to all User reads, updates, and deletes, which implies application level authentication. User level authentication should scope all requests to the current user.
