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

Creates a user.

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

*Params:*
* id

*Response:*
(none)
