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
  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIP('4')
  ipv4_address: string;

  @IsOptional()
  @IsEnum(GatewayStatus)
  status?: GatewayStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUUID()
  tenant_id?: string;
}

export class UpdateGatewayDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsIP('4')
  ipv4_address?: string;

  @IsOptional()
  @IsEnum(GatewayStatus)
  status?: GatewayStatus;

  @IsOptional()
  @IsString()
  location?: string;
}
