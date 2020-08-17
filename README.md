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
TIMEZONE=0
CREATE_CALENDAR=true
OVERRIDE_URL=false
```

`PORT` | Server port

`HOSTNAME` | Default server hostname

`REDIS_PORT` | Redis server port

`REDIS_HOSTNAME` | Redis hostname

`REDIS_CACHE_TIME` | Cache time for redis in seconds, default 900 s or 15 min

`CREATE_CALENDAR` | Config if the `.ics` file should be create or not, use in development, creates the file in default.

`OVERRIDE_URL` | Override URL signature checker

`TIMEZONE` | Adjust the timezone if needs to

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
