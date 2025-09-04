import { DeviceStatus } from '../entities/peripheral-device.entity';

export class DeviceResponseDto {
  id: string;
  uid: number;
  vendor: string;
  status: DeviceStatus;
  created_at: Date;
  last_seen_at?: Date;
  gateway_id?: string;
  device_type_id: number;
}

export class DeviceWithTypeResponseDto extends DeviceResponseDto {
  device_type?: {
    id: number;
    name: string;
    description?: string;
  };
}

export class DeviceWithGatewayResponseDto extends DeviceResponseDto {
  gateway?: {
    id: string;
    name: string;
    serial_number: string;
    ipv4_address: string;
    status: string;
  };
}
