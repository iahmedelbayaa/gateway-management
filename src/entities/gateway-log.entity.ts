import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Gateway } from './gateway.entity';

@Entity('gateway_logs')
export class GatewayLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'uuid' })
  @IsUUID()
  gateway_id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  action: string;

  @Column({ type: 'jsonb' })
  details: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Gateway, (gateway) => gateway.logs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gateway_id' })
  gateway: Gateway;
}
