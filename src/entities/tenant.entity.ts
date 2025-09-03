import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Gateway } from './gateway.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsEmail()
  contact_email: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Gateway, (gateway) => gateway.tenant_id)
  gateways: Gateway[];
}
