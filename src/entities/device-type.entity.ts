import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity('device_types')
export class DeviceType {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
