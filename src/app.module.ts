import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  Gateway,
  GatewayLog,
  PeripheralDevice,
  Tenant,
  DeviceType,
} from './entities';
import { GatewayController } from './controllers/gateway.controller';
import { DeviceController } from './controllers/device.controller';
import { DeviceService } from './services/device.service';
import { GatewayService } from './services/gateway.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'gateway_management',
      entities: [Gateway, PeripheralDevice, GatewayLog, Tenant, DeviceType],
      synchronize: false, // Use migrations instead
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([
      Gateway,
      PeripheralDevice,
      GatewayLog,
      Tenant,
      DeviceType,
    ]),
  ],
  controllers: [GatewayController, DeviceController],
  providers: [GatewayService, DeviceService],
})
export class AppModule {}
