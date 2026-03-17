<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://nodejs.org" target="_blank"><img src="https://img.shields.io/badge/node-%3E%3D22.0.0-green.svg" alt="Node.js version" /></a>
<a href="https://pnpm.io" target="_blank"><img src="https://img.shields.io/badge/pnpm-%3E%3D10.0.0-cc00ff.svg" alt="pnpm version" /></a>
<a href="./LICENSE" target="_blank"><img src="https://img.shields.io/github/license/igorer88/nestjs-paw-template" alt="Package License" /></a>
</p>

## Description

Base [Nest](https://github.com/nestjs/nest) framework template for creating efficient and scalable server-side applications.
This template is configured to use pnpm as the package manager and SWC as the compiler.

## Project setup

```bash
$ pnpm install
```

## Environment Setup

Copy the example environment file and configure your variables:

```bash
$ cp .env.example .env
```

### Generate API_SECRET_KEY

Generate a secure secret key for the application:

```bash
$ pnpm run generate:secret
```

Copy the generated key and set it as `API_SECRET_KEY` in your `.env` file.

## Database Configuration

This project supports SQLite (default) and PostgreSQL. Configure via the `DB_DRIVER` environment variable.

### SQLite (Default)

```bash
DB_DRIVER=sqlite
DB_SQLITE_PATH=config/db/db.sqlite3
```

### PostgreSQL

```bash
DB_DRIVER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=postgres
DB_PASSWORD=your-password
```

### Run Migrations

```bash
$ pnpm run migration:run
```

## Database Constraint Handling

When adding entities with unique constraints (e.g., email, username, phone), implement constraint error handling:

1. Define constraint names in `src/shared/errors/enums/database-errors.enum.ts`
2. Add handling logic in `src/shared/errors/database-errors.service.ts`

Example constraints: `UQ_EMAIL_ADDRESS`, `UQ_USERNAME`, `UQ_PHONE_NUMBER`

## Docker

Run the project with PostgreSQL using Docker:

```bash
# Start the containers
$ docker-compose up -d

# Stop the containers
$ docker-compose down
```

The API will be available at `http://localhost:3000` and PostgreSQL at port `5432`.

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## API Documentation

Swagger documentation is available at `http://localhost:3000/docs` when the application is running.

## Linting and Formatting

```bash
# lint
$ pnpm run lint

# format
$ pnpm run format
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

This project is [MIT licensed](./LICENSE).
