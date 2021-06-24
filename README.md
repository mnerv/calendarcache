# Calendar middleman

Parse the raw `html` to `ics` file for calendars to use.

## Table of Contents

- [Calendar middleman](#calendar-middleman)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [How to run](#how-to-run)
    - [Environment variables](#environment-variables)
    - [Development](#development)
    - [Production](#production)
  - [How to use](#how-to-use)
    - [Calendar route](#calendar-route)

## Requirements

- nodejs
- docker

## How to run

### Environment variables

Create `.env` file in the root directory to config the server

Default value for the environment

```
PORT=3000
HOSTNAME='localhost'
REDIS_PORT=6379
REDIS_HOSTNAME='redis'
REDIS_CACHE_TIME=900
CREATE_CALENDAR=true
OVERRIDE_URL=false
JWT_EXPIRATION=1h
SALT=10
```

`PORT` | Server port

`HOSTNAME` | Default server hostname

`REDIS_PORT` | Redis server port

`REDIS_HOSTNAME` | Redis hostname

`REDIS_CACHE_TIME` | Cache time for redis in seconds, default 900 s or 15 min

`CREATE_CALENDAR` | Config if the `.ics` file should be create or not, use in development, creates the file in default.

`OVERRIDE_URL` | Override URL signature checker

`JWT_SECRET` | Secret key to generate tokens, set before production

`JWT_EXPIRATION` | Set the expiration for the tokens, format `60, "2 days", "10h", "7d"`. Read more [here](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback).

`SALT` | bcrypt salt round, `number`.

### Development

Start redis docker container

```
docker-compose -f docker-compose.dev.yml
```

Start the server

```
yarn dev
```

To test redis use this command to get inside docker container with redis-cli running.

```
docker exec -it calendar_cache_redis redis-cli
```

### Production

The default port the service is running on is `3000`.

Stop

```
docker-compose down
```

Start

```
docker-compose up -d
```

## How to use

The admin token is generate in data file under the name `admin_access.token`. This is generated the first time the app runs. The token is required to create users with admin privilege. You can remove both `admin.secret` and `admin_access.token` to regenerate them.

The `POST` path to create user is

```
/auth/create?token=<token_here>
```

The body for `create` and `login` route needs contain `json` file with these value

```
{
  "username": "username_here",
  "password": "password_here"
}
```

Login route is

```
/auth/login
```

### Calendar route

You can list the calendar like this

```
/calendar/all
```
