import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceStatus } from '../entities/peripheral-device.entity';

export class CreateDeviceDto {
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @IsString()
  @IsNotEmpty()
  vendor: string;

  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  @IsNumber()
  device_type_id: number;
}

export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vendor?: string;

  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  @IsOptional()
  @IsNumber()
  device_type_id?: number;
}
