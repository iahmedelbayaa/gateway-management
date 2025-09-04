import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'gateway_management',
  entities: ['src/entities/*.entity.{js,ts}'],
  migrations: ['src/db/migrations/*.{js,ts}'],
  synchronize: false, // Always false for migrations
  logging: process.env.NODE_ENV === 'development',
});
