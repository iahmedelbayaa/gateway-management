import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsEnum,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PeripheralDevice } from './peripheral-device.entity';
import { GatewayLog } from './gateway-log.entity';

export enum GatewayStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DECOMMISSIONED = 'decommissioned',
}

@Entity('gateways')
export class Gateway {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsIP('4')
  ipv4_address: string;

  @Column({
    type: 'enum',
    enum: GatewayStatus,
    default: GatewayStatus.ACTIVE,
  })
  @IsEnum(GatewayStatus)
  status: GatewayStatus;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PeripheralDevice, (device) => device.gateway, {
    cascade: true,
  })
  devices: PeripheralDevice[];

  @OneToMany(() => GatewayLog, (log) => log.gateway, {
    cascade: true,
  })
  logs: GatewayLog[];

  // Optional tenant relationship
  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  tenant_id?: string;
}
