import { GatewayStatus } from '../entities/gateway.entity';

export class GatewayResponseDto {
  id: string;
  serial_number: string;
  name: string;
  ipv4_address: string;
  status: GatewayStatus;
  location?: string;
  created_at: Date;
  updated_at: Date;
  tenant_id?: string;
}

export class GatewayWithDevicesResponseDto extends GatewayResponseDto {
  devices_count: number;
  devices?: {
    id: string;
    uid: number;
    vendor: string;
    status: string;
    created_at: Date;
    last_seen_at?: Date;
  }[];
}
