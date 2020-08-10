# Calendar middleman

Parse the raw `html` to `ics` file for calendars to use.

## Table of Contents

- [Calendar middleman](#calendar-middleman)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [How to run](#how-to-run)
    - [Development](#development)
    - [Production](#production)

## Requirements

- nodejs
- docker

## How to run

Start redis docker container

```
docker-compose -f docker-compose.dev.yml
```

### Development

```
yarn dev
```

To test redis use, to get into docker container and use the command line

```
docker exec -it calendar_redis redis-cli
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
