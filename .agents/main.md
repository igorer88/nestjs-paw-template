# AGENTS.md

## Project Overview

This project is a base template for building scalable server-side applications using the **NestJS** framework. It is pre-configured with essential tools and patterns to accelerate development.

### Core Technologies

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [TypeORM](https://typeorm.io/) with support for **PostgreSQL** and **SQLite**.
- **Compiler:** [SWC](https://swc.rs/) for fast compilation.
- **Package Manager:** [pnpm](https://pnpm.io/).
- **Validation:** [class-validator](https://github.com/typestack/class-validator) and [Joi](https://joi.dev/).
- **Documentation:** [Swagger/OpenAPI](https://swagger.io/) (available at `/docs`).
- **Security:** [Helmet](https://helmetjs.github.io/) for setting various HTTP headers.

### Architecture

The project follows a modular architecture:

- `src/app.module.ts`: Root module that orchestrates configuration and core modules.
- `src/config/`: Centralized configuration management using `@nestjs/config` and environment validation.
- `src/database/`: Database connection and provider logic.
- `src/shared/`: Global components, including custom error handling, interceptors, and utilities.
- `test/`: Contains E2E tests.

---

## Building and Running

### Prerequisites

- Node.js >= 24.x
- pnpm >= 10.x

### Commands

| Task                     | Command                |
| :----------------------- | :--------------------- |
| **Install Dependencies** | `pnpm install`         |
| **Start (Dev)**          | `pnpm run start:dev`   |
| **Start (Debug)**        | `pnpm run start:debug` |
| **Build**                | `pnpm run build`       |
| **Start (Prod)**         | `pnpm run start:prod`  |
| **Lint**                 | `pnpm run lint`        |
| **Format**               | `pnpm run format`      |

### Database Migrations

Migrations are handled via TypeORM CLI:

- **Generate:** `pnpm migration:generate`
- **Run:** `pnpm migration:run`
- **Revert:** `pnpm migration:revert`

### Environment Variables

The `.env` file is for **local development only**. It is already in `.gitignore` and should never be committed.

#### Generating Secrets

Generate a new secret key for production:

```bash
pnpm generate:secret
```

#### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set `BUILD_STAGE=prod` (for Docker builds)
- [ ] Generate and set a strong `API_SECRET_KEY`
- [ ] Set `ALLOWED_ORIGINS` to your production domain(s)
- [ ] Use strong database credentials (not defaults)
- [ ] Enable PostgreSQL SSL in production

### Testing

- **Unit Tests:** `pnpm run test` - Located alongside source files (`*.spec.ts`)
- **E2E Tests:** `pnpm run test:e2e` - Located in `test/` directory
- **Coverage:** `pnpm run test:cov`
- **Watch Mode:** `pnpm run test:watch`
- **Debug:** `pnpm run test:debug`

#### Test Structure

```bash
src/
  domains/users/
    users.service.ts          # Source file
    users.service.spec.ts    # Unit test (co-located with source)
test/
  app.e2e-spec.ts           # E2E tests
  health.e2e-spec.ts
```

- **Unit tests**: Co-located with source files using `.spec.ts` suffix
- **E2E tests**: Located in `test/` directory using `.e2e-spec.ts` suffix

#### Rate Limiting

The application uses `@nestjs/throttler` for API rate limiting:

```bash
# Configure via environment variables
THROTTLE_TTL=60000    # Time-to-live in milliseconds (default: 60000)
THROTTLE_LIMIT=100    # Max requests per TTL (default: 100)
```

- Default: 100 requests per minute per IP
- Returns `429 Too Many Requests` when exceeded
- Health endpoints (`/v1/health`) are protected by rate limiting

#### Running a Single Test

```bash
# Run a specific test file
pnpm test -- path/to/test.spec.ts

# Run tests matching a pattern (regex)
pnpm test -- --testNamePattern="pattern"

# Run specific test in watch mode
pnpm test:watch -- path/to/test.spec.ts

# Run specific E2E test
pnpm test:e2e -- path/to/test.e2e.spec.ts
```

---

## Code Style Guidelines

### Naming Conventions

- **Classes/Interfaces**: PascalCase (e.g., `UserService`, `AuthController`)
- **Interfaces**: PascalCase without `I` prefix (e.g., `User`, NOT `IUser`) - This convention is no longer enforced by linter but should still be followed manually
- **Methods/Variables**: camelCase
- **Files**: kebab-case (e.g., `user-service.ts`, `auth.controller.ts`)
- **Constants**: SCREAMING_SNAKE_CASE

### Import Order (Enforced by oxlint)

Imports must be sorted in this exact order:

1. **Node built-ins** - e.g., `node:path`, `node:fs`
2. **External packages** - e.g., `@nestjs/common`, `class-validator`
3. **Internal packages** - e.g., `@/` path aliases
4. **Relative imports** - parent/sibling imports (`../`, `./`)
5. **Index imports** - barrel exports

Each group must have a newline separating them. Example:

```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { UserEntity } from '@/entities/user.entity'
import { UserService } from '@/services/user.service'
import { AnotherModule } from '../another.module'
```

### Formatting Rules

- **No semicolons** at the end of statements
- **No spaces** inside parentheses: `function(args)` NOT `function( args )`
- **Spaces** before blocks: `if (x) {` NOT `if (x){`
- **Strict key spacing**: no space before colon, space after
- **Keywords**: spaces before and after keywords (`if`, `else`, `for`, etc.)
- **No trailing spaces**

### TypeScript Rules

- **Avoid `any`**: Use `unknown` or proper typing instead (error level)
- **Explicit return types** on functions (warn)
- **Explicit parameter types** on exported functions (warn)
- **No `var`**: Use `const` or `let`
- **No `no-var-requires`**: Use ES6 imports
- **Unused variables** trigger warnings

### Design Patterns

- Apply **SOLID principles**:
  - **S**ingle Responsibility: one reason to change
  - **O**pen/Closed: open for extension, closed for modification
  - **L**iskov Substitution: subtypes must be substitutable
  - **I**nterface Segregation: many specific interfaces > one general
  - **D**ependency Inversion: depend on abstractions, not concretions
- Use common patterns when appropriate:
  - **Factory**: create objects without specifying exact class
  - **Repository**: abstract data access layer
  - **Strategy**: encapsulate interchangeable algorithms
  - **Observer**: publish-subscribe for event handling
  - **Singleton**: one instance per application
  - **Builder**: complex object construction
- Choose patterns that solve recurring problems - avoid over-engineering

### Performance

- Write performant code using appropriate design patterns
- Optimize loops and iterations: avoid nested loops when possible
- Reduce unnecessary allocations: reuse objects, use pooling
- Improve data structure choices: arrays vs maps vs sets based on use case
- Cache expensive computations: memoization, computed values
- Prefer primitive types over boxed types
- Use lazy loading for heavy resources

### NestJS Patterns

#### DTOs (`.dto.ts` files)

- **REQUIRED**: Use `class-validator` decorators for validation
- **REQUIRED**: Use `class-transformer` for serialization
- **REQUIRED**: Include Swagger decorators (`@ApiProperty`, `@ApiPropertyOptional`)
- Place in a `dto/` subdirectory within the module

#### Controllers

- **REQUIRED**: Use Swagger decorators for documentation
- **NEVER** inject repositories directly - inject services only
- Keep methods short and focused (single responsibility)
- Use proper HTTP method decorators (`@Get`, `@Post`, `@Put`, `@Delete`)

#### Services

- Business logic should live here
- **REQUIRED**: Use `ClientException` from the shared module for errors
- Use strict typings - avoid `any`
- Inject repositories via TypeORM, but expose through service methods

#### Modules

- Avoid circular dependencies
- Only use `forwardRef()` as a last resort
- Declare providers, controllers, imports, and exports clearly

### Error Handling

- Use the centralized error handling system in `src/shared/errors/`
- Prefer throwing standard NestJS exceptions or custom exceptions derived from `BaseError`
- `AllExceptionsFilter` catches and formats all outgoing errors consistently
- Use `ClientException` for service-level errors with appropriate HTTP codes

### Validation

- Use `ValidationPipe` for global request validation
- Annotate DTOs with `class-validator` decorators (`@IsString`, `@IsEmail`, `@IsOptional`, etc.)
- Environment variables validated using Joi schemas in `src/config/environment/validation.schema.ts`

### Versioning

- URI-based versioning enabled by default (e.g., `/v1/...`)
- Versioning configured in `src/setup.ts`

#### API Endpoints

| Endpoint  | Path            |
| --------- | --------------- |
| Health    | `/v1/health`    |
| Health DB | `/v1/health/db` |
| Other API | `/api/v1/...`   |

> **Note:** Health endpoints bypass the global `/api` prefix but retain versioning (`/v1`).

### Documentation

- Swagger documentation auto-generated at `/docs`
- Use `@ApiProperty`, `@ApiOperation`, `@ApiResponse`, `@ApiTags` on controllers and DTOs

---

## Development Workflow

### Before Committing

1. Run `pnpm lint` to check and fix linting issues
2. Run `pnpm format` to format code
3. Run tests to ensure nothing is broken: `pnpm test`
4. For E2E tests: `pnpm test:e2e`

### Development Guidelines Files

- **DTOs**: See `.agents/rules/dtos.md`
- **Controllers**: See `.agents/rules/controllers.md`
- **Modules**: See `.agents/rules/modules.md`
- **Services**: See `.agents/rules/services.md`

### MCP Tools

Use NestJsMcp MCP tools when available. It should be configured in `.agents/mcp.json`. If not configured, ignore.

---

## Dependencies

- Node.js >= 24.x
- pnpm >= 10.x

---

## Refactoring Best Practices

### Basic Refactoring

- Extract methods and functions
- Rename variables, functions, and classes
- Move code between files/modules
- Inline redundant code
- Split large functions into smaller pieces

### Code Simplification

- Reduce nested conditionals
- Simplify complex boolean expressions
- Remove dead code
- Clean up duplicate code
- Improve readability
