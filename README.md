User API written in Hapi
-----------

### Technologies
* Hapi
* PostgreSQL

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
