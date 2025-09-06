# Gateway Management System

A comprehensive REST API for managing gateways and their associated peripheral devices, built with Node.js, NestJS, and PostgreSQL.

## 🚀 Features

- **Gateway Management**: Create, read, and delete gateways
- **Device Management**: Manage peripheral devices with global unique identifiers
- **Device Assignment**: Attach/detach devices to/from gateways (max 10 devices per gateway)
- **Data Validation**: Comprehensive input validation with proper error handling
- **Database Migrations**: Structured database schema with seeding capabilities
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Testing**: Unit and E2E tests with comprehensive coverage
- **Logging**: Gateway activity logging with detailed audit trail

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Database Schema](#database-schema)
- [Environment Configuration](#environment-configuration)
- [Development](#development)

## 📦 Prerequisites

- **Node.js** 18+
- **PostgreSQL** 12+
- **npm** or **yarn**

## ⚡ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gateway-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your database configuration
   ```

## 🗄️ Database Setup

1. **Create PostgreSQL database**

   ```sql
   CREATE DATABASE gateway_management;
   CREATE USER gateway_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE gateway_management TO gateway_user;
   ```

2. **Run database migrations**

   ```bash
   npm run migration:run
   ```

3. **Seed test data (optional)**

   ```bash
   npm run seed
   ```

4. **Complete database setup (migrations + seed)**
   ```bash
   npm run db:setup
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

The application will be available at:

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## 📡 API Endpoints

### Gateway Endpoints

| Method   | Endpoint                                 | Description                       |
| -------- | ---------------------------------------- | --------------------------------- |
| `POST`   | `/gateways`                              | Create a new gateway              |
| `GET`    | `/gateways`                              | Get all gateways                  |
| `GET`    | `/gateways/:id`                          | Get gateway details by ID         |
| `DELETE` | `/gateways/:id`                          | Delete gateway                    |
| `POST`   | `/gateways/:gatewayId/devices`           | Add new device to gateway         |
| `POST`   | `/gateways/:gatewayId/devices/:deviceId` | Attach existing device to gateway |
| `DELETE` | `/gateways/:gatewayId/devices/:deviceId` | Remove device from gateway        |

### Device Endpoints

| Method   | Endpoint         | Description                |
| -------- | ---------------- | -------------------------- |
| `POST`   | `/devices`       | Create a new device        |
| `GET`    | `/devices`       | Get all devices            |
| `GET`    | `/devices/:id`   | Get device details by ID   |
| `DELETE` | `/devices/:id`   | Delete device              |
| `GET`    | `/devices/types` | Get available device types |

### Example API Usage

**Create a Gateway:**

```bash
curl -X POST http://localhost:3000/gateways
  -H "Content-Type: application/json"
  -d '{
    "serial_number": "GW-001-ABC123",
    "name": "Main Building Gateway",
    "ipv4_address": "192.168.1.100",
    "status": "active",
    "location": "Building A, Floor 1"
  }'
```

**Create a Device:**

```bash
curl -X POST http://localhost:3000/devices
  -H "Content-Type: application/json"
  -d '{
    "uid": 1001,
    "vendor": "Siemens",
    "status": "online",
    "device_type_id": 1
  }'
```

**Attach Device to Gateway:**

```bash
curl -X POST http://localhost:3000/gateways/{gateway-id}/devices/{device-id}
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:cov
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

## 🏗️ Database Schema

### Core Entities

#### **Gateway**

- `id` (UUID, Primary Key)
- `serial_number` (String, Unique, Immutable)
- `name` (String, Required)
- `ipv4_address` (IPv4, Unique, Validated)
- `status` (Enum: active, inactive, decommissioned)
- `location` (String, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `tenant_id` (UUID, Foreign Key, Optional)

#### **Peripheral Device**

- `id` (UUID, Primary Key)
- `uid` (BigInt, Globally Unique)
- `vendor` (String, Required)
- `status` (Enum: online, offline, maintenance)
- `created_at` (Timestamp)
- `last_seen_at` (Timestamp, Nullable)
- `gateway_id` (UUID, Foreign Key, Nullable)
- `device_type_id` (Integer, Foreign Key)

#### **Device Type**

- `id` (Serial, Primary Key)
- `name` (String, Unique)
- `description` (Text)

#### **Gateway Log**

- `id` (BigSerial, Primary Key)
- `gateway_id` (UUID, Foreign Key)
- `action` (String)
- `details` (JSONB)
- `created_at` (Timestamp)

#### **Tenant (Optional)**

- `id` (UUID, Primary Key)
- `name` (String, Unique)
- `contact_email` (String)
- `created_at` (Timestamp)

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=gateway_management

# Application Configuration
PORT=3000
NODE_ENV=development
```

## 🛠️ Development

### Code Structure

```
src/
├── controllers/          # REST API controllers (gateway, device)
├── services/            # Business logic services
├── entities/            # TypeORM entities
├── dtos/               # Data transfer objects
├── db/                 # Database configuration & migrations
│   ├── migrations/     # Database migration files
│   └── seeds/         # Database seeding scripts
└── main.ts            # Application entry point
```

### Development Scripts

```bash
# Format code
npm run format

# Lint code
npm run lint

# Generate new migration
npm run migration:generate -- -n MigrationName

# Revert last migration
npm run migration:revert
```

## 📋 Business Rules

1. **Gateway Device Limit**: Maximum 10 devices per gateway
2. **Global Device UID**: Device UID must be globally unique across all devices
3. **Serial Number Immutability**: Gateway serial numbers cannot be changed after creation
4. **IP Address Uniqueness**: Each gateway must have a unique IPv4 address
5. **Device Orphaning**: When a gateway is deleted, devices become orphaned (gateway_id = NULL)
6. **Audit Logging**: All gateway operations are logged with details

## 🐛 Error Handling

The API provides comprehensive error responses:

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate unique field values
- **500 Internal Server Error**: Server-side errors

## 🔒 Validation Rules

- **Serial Number**: Required, unique, immutable
- **IPv4 Address**: Valid IPv4 format, unique
- **Device UID**: Required, globally unique integer
- **Gateway Status**: Must be one of: active, inactive, decommissioned
- **Device Status**: Must be one of: online, offline, maintenance

## 📚 API Documentation

Interactive API documentation is available at `/api` when the application is running. The Swagger UI provides:

- Complete endpoint documentation
- Request/response schemas
- Interactive testing interface
- Authentication details (if implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License - see the LICENSE file for details.

---

## 🚀 Quick Start Guide

1. **Install dependencies**: `npm install`
2. **Setup database**: Create PostgreSQL database and update `.env`
3. **Initialize database**: `npm run db:setup`
4. **Start development server**: `npm run start:dev`
5. **Visit API documentation**: http://localhost:3000/api

Your gateway management system is now ready! 🎉

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
