import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Gateway } from 'src/entities/gateway.entity';
import { PeripheralDevice } from 'src/entities/peripheral-device.entity';
import { GatewayLog } from 'src/entities/gateway-log.entity';
import { Tenant } from 'src/entities/tenant.entity';
import { DeviceType } from 'src/entities/device-type.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'gateway_management',
  entities: [Gateway, PeripheralDevice, GatewayLog, Tenant, DeviceType],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});
