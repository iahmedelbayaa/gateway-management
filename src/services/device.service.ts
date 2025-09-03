import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceDto, UpdateDeviceDto, DeviceResponseDto } from 'src/dtos';
import { DeviceType, PeripheralDevice } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(PeripheralDevice)
    private deviceRepository: Repository<PeripheralDevice>,
    @InjectRepository(DeviceType)
    private deviceTypeRepository: Repository<DeviceType>,
  ) {}

  async addDevice(
    createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceResponseDto> {
    try {
      const existingDevice = await this.deviceRepository.findOne({
        where: { uid: createDeviceDto.uid },
      });
      if (existingDevice) {
        throw new ConflictException(
          `Device with UID ${createDeviceDto.uid} already exists`,
        );
      }

      // Verify device type exists
      const deviceType = await this.deviceTypeRepository.findOne({
        where: { id: createDeviceDto.device_type_id },
      });
      if (!deviceType) {
        throw new NotFoundException(
          `Device type with ID ${createDeviceDto.device_type_id} not found`,
        );
      }

      const device = this.deviceRepository.create(createDeviceDto);
      const savedDevice = await this.deviceRepository.save(device);
      return this.toResponseDto(savedDevice);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error('Unexpected error');
    }
  }

  async updateDevice(
    id: string,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceResponseDto> {
    try {
      const device = await this.deviceRepository.findOne({ where: { id } });
      if (!device) {
        throw new NotFoundException(`Device with ID ${id} not found`);
      }

      // Update device properties
      Object.assign(device, updateDeviceDto);
      const updatedDevice = await this.deviceRepository.save(device);
      return this.toResponseDto(updatedDevice);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error('Unexpected error');
    }
  }

  async deleteDevice(id: string): Promise<void> {
    try {
      const device = await this.deviceRepository.findOne({ where: { id } });
      if (!device) {
        throw new NotFoundException(`Device with ID ${id} not found`);
      }
      await this.deviceRepository.remove(device);
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error('Unexpected error');
    }
  }

  async getAllDevices(): Promise<DeviceResponseDto[]> {
    const devices = await this.deviceRepository.find({
      order: { created_at: 'DESC' },
    });
    return devices.map((device) => this.toResponseDto(device));
  }

  async getDeviceById(id: string): Promise<DeviceResponseDto> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return this.toResponseDto(device);
  }

  async getDevicesByGateway(gatewayId: string): Promise<DeviceResponseDto[]> {
    const devices = await this.deviceRepository.find({
      where: { gateway_id: gatewayId },
      order: { created_at: 'DESC' },
    });
    return devices.map((device) => this.toResponseDto(device));
  }

  private toResponseDto(device: PeripheralDevice): DeviceResponseDto {
    return {
      id: device.id,
      uid: device.uid,
      vendor: device.vendor,
      status: device.status,
      created_at: device.created_at,
      last_seen_at: device.last_seen_at,
      gateway_id: device.gateway_id,
      device_type_id: device.device_type_id,
    };
  }
}
