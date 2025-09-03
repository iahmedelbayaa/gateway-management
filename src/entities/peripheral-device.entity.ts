import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { DeviceType } from './device-type.entity';
import { Gateway } from './gateway.entity';

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
}

@Entity('peripheral_devices')
export class PeripheralDevice {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ type: 'bigint', unique: true })
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  vendor: string;

  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.OFFLINE,
  })
  @IsEnum(DeviceStatus)
  status: DeviceStatus;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  last_seen_at?: Date;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  gateway_id?: string;

  @Column()
  @IsNumber()
  device_type_id: number;

  @ManyToOne(() => Gateway, (gateway) => gateway.devices, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'gateway_id' })
  gateway?: Gateway;

  @ManyToOne(() => DeviceType)
  @JoinColumn({ name: 'device_type_id' })
  deviceType: DeviceType;
}
