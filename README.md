# Calendar middleman

Parse the raw `html` to `ics` file for calendars to use.

## Table of Contents

- [Calendar middleman](#calendar-middleman)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [How to run](#how-to-run)
    - [Development](#development)
    - [Production](#production)
  - [Database structure](#database-structure)

## Requirements

- nodejs
- docker

## How to run

Start docker container

```
docker-compose up -d
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


Clean the build folders

```
yarn clean
```

Compile Typescript to Javascript

```
yarn build
```

## Database structure

```sql
CREATE TABLE calendars (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(512),
  link VARCHAR(512),
  created DATE,
  updated DATE
)
```

```sql
CREATE TABLE calendars_location (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  calendar_id BIGSERIAL,
  folder_name VARCHAR(512)
)
```
