import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { GatewayStatus } from '../entities/gateway.entity';

export class CreateGatewayDto {
  @ApiProperty({
    description: 'Unique serial number for the gateway',
    example: 'GW-001-ABC123',
  })
  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @ApiProperty({
    description: 'Human-readable name for the gateway',
    example: 'Main Building Gateway',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'IPv4 address of the gateway',
    example: '192.168.1.100',
  })
  @IsIP('4')
  ipv4_address: string;

  @ApiProperty({
    description: 'Operational status of the gateway',
    enum: GatewayStatus,
    default: GatewayStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(GatewayStatus)
  status?: GatewayStatus;

  @ApiProperty({
    description: 'Physical location of the gateway',
    example: 'Building A, Floor 2, Room 201',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Tenant ID that owns this gateway',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  tenant_id?: string;
}

export class UpdateGatewayDto {
  @ApiProperty({
    description: 'Human-readable name for the gateway',
    example: 'Updated Gateway Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'IPv4 address of the gateway',
    example: '192.168.1.101',
    required: false,
  })
  @IsOptional()
  @IsIP('4')
  ipv4_address?: string;

  @ApiProperty({
    description: 'Operational status of the gateway',
    enum: GatewayStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(GatewayStatus)
  status?: GatewayStatus;

  @ApiProperty({
    description: 'Physical location of the gateway',
    example: 'Building B, Floor 1, Room 101',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;
}
