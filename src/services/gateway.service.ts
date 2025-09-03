import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateGatewayDto,
  UpdateGatewayDto,
  GatewayResponseDto,
} from 'src/dtos';
import { Gateway, GatewayLog } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GatewayService {
  constructor(
    @InjectRepository(Gateway)
    private gatewayRepository: Repository<Gateway>,
    @InjectRepository(GatewayLog)
    private gatewayLogRepository: Repository<GatewayLog>,
  ) {}

  async createGateway(
    createGatewayDto: CreateGatewayDto,
  ): Promise<GatewayResponseDto> {
    try {
      const existingBySerial = await this.gatewayRepository.findOne({
        where: { serial_number: createGatewayDto.serial_number },
      });
      if (existingBySerial) {
        throw new ConflictException(
          `Gateway with serial number ${createGatewayDto.serial_number} already exists`,
        );
      }
      const existingByIp = await this.gatewayRepository.findOne({
        where: { ipv4_address: createGatewayDto.ipv4_address },
      });
      if (existingByIp) {
        throw new ConflictException(
          `Gateway with IP address ${createGatewayDto.ipv4_address} already exists`,
        );
      }

      const gateway = this.gatewayRepository.create(createGatewayDto);
      const savedGateway = await this.gatewayRepository.save(gateway);

      // Create log entry
      await this.createLog(savedGateway.id, 'CREATED', {
        gateway: savedGateway,
      });

      return this.toResponseDto(savedGateway);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(
        `Gateway with serial number ${createGatewayDto.serial_number} already exists`,
      );
    }
  }

  async getAllGateways(): Promise<GatewayResponseDto[]> {
    const gateways = await this.gatewayRepository.find({
      order: { created_at: 'DESC' },
    });
    return gateways.map((gateway) => this.toResponseDto(gateway));
  }

  async getGatewayById(id: string): Promise<GatewayResponseDto> {
    const gateway = await this.gatewayRepository.findOne({ where: { id } });
    if (!gateway) {
      throw new ConflictException(`Gateway with ID ${id} not found`);
    }
    return this.toResponseDto(gateway);
  }

  async updateGateway(
    id: string,
    updateGatewayDto: UpdateGatewayDto,
  ): Promise<GatewayResponseDto> {
    try {
      const gateway = await this.gatewayRepository.findOne({ where: { id } });
      if (!gateway) {
        throw new ConflictException(`Gateway with ID ${id} not found`);
      }

      if (updateGatewayDto.ipv4_address) {
        const existingByIp = await this.gatewayRepository.findOne({
          where: { ipv4_address: updateGatewayDto.ipv4_address },
        });
        if (existingByIp && existingByIp.id !== id) {
          throw new ConflictException(
            `Gateway with IP address ${updateGatewayDto.ipv4_address} already exists`,
          );
        }
      }

      // Update gateway properties
      Object.assign(gateway, updateGatewayDto);
      const updatedGateway = await this.gatewayRepository.save(gateway);

      // Create log entry
      await this.createLog(updatedGateway.id, 'UPDATED', {
        gateway: updatedGateway,
      });

      return this.toResponseDto(updatedGateway);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(`Failed to update gateway with ID ${id}`);
    }
  }

  async deleteGateway(id: string): Promise<void> {
    try {
      const gateway = await this.gatewayRepository.findOne({ where: { id } });
      if (!gateway) {
        throw new ConflictException(`Gateway with ID ${id} not found`);
      }

      await this.gatewayRepository.remove(gateway);

      // Create log entry
      await this.createLog(gateway.id, 'DELETED', {
        gateway,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(`Failed to delete gateway with ID ${id}`);
    }
  }

  private async createLog(
    gatewayId: string,
    action: string,
    details: Record<string, any>,
  ): Promise<void> {
    const log = this.gatewayLogRepository.create({
      gateway_id: gatewayId,
      action,
      details,
    });
    await this.gatewayLogRepository.save(log);
  }

  private toResponseDto(gateway: Gateway): GatewayResponseDto {
    return {
      id: gateway.id,
      serial_number: gateway.serial_number,
      name: gateway.name,
      ipv4_address: gateway.ipv4_address,
      status: gateway.status,
      location: gateway.location,
      created_at: gateway.created_at,
      updated_at: gateway.updated_at,
      tenant_id: gateway.tenant_id,
    };
  }
}
