# Calendar Cache

Calendar cache service parse `html` and convert it to an `ics` file.

## Requirements

 - [nodejs](https://nodejs.dev)
 - [docker](https://www.docker.com)
 - [docker-compose](https://docs.docker.com/compose/)

## Development

Install the required packages

```
yarn
```

Run the `redis` service with docker

```
docker-compose -f docker-compose.dev.yml up -d
```

Run typescript in watch mode

```
yarn watch
```

Run the development server

```
yarn dev
```

## Production

The configurable environment variable can be found in [sample.env](docs/sample.env) file. The value on the right indicate the defaults.

Run the whole service with redis using `docker-compose`

```
docker-compose up -d
```
