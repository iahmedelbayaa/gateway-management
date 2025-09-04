import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeviceStatus } from '../entities/peripheral-device.entity';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Globally unique identifier for the device',
    example: 1234567890,
  })
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @ApiProperty({
    description: 'Device vendor or manufacturer',
    example: 'Siemens Industrial',
  })
  @IsString()
  @IsNotEmpty()
  vendor: string;

  @ApiProperty({
    description: 'Current operational status of the device',
    enum: DeviceStatus,
    default: DeviceStatus.OFFLINE,
  })
  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  @ApiProperty({
    description: 'Device type ID',
    example: 1,
  })
  @IsNumber()
  device_type_id: number;
}

export class UpdateDeviceDto {
  @ApiProperty({
    description: 'Device vendor or manufacturer',
    example: 'Siemens Industrial Updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vendor?: string;

  @ApiProperty({
    description: 'Current operational status of the device',
    enum: DeviceStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  @ApiProperty({
    description: 'Device type ID',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  device_type_id?: number;
}
