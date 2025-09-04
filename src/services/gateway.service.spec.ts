import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GatewayService } from './gateway.service';
import {
  Gateway,
  GatewayStatus,
  GatewayLog,
  PeripheralDevice,
} from '../entities';
import {
  CreateGatewayDto,
  UpdateGatewayDto,
  GatewayResponseDto,
} from '../dtos';
import { ConflictException } from '@nestjs/common';

describe('GatewayService', () => {
  let service: GatewayService;
  let gatewayRepository: Repository<Gateway>;
  let gatewayLogRepository: Repository<GatewayLog>;
  let peripheralDeviceRepository: Repository<PeripheralDevice>;

  const mockGateway: Gateway = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    serial_number: 'GW-001-TEST',
    name: 'Test Gateway',
    ipv4_address: '192.168.1.100',
    status: GatewayStatus.ACTIVE,
    location: 'Test Location',
    created_at: new Date(),
    updated_at: new Date(),
    devices: [],
    logs: [],
    tenant_id: undefined,
  };

  const mockRepositoryFactory = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        {
          provide: getRepositoryToken(Gateway),
          useFactory: mockRepositoryFactory,
        },
        {
          provide: getRepositoryToken(GatewayLog),
          useFactory: mockRepositoryFactory,
        },
        {
          provide: getRepositoryToken(PeripheralDevice),
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
    gatewayRepository = module.get<Repository<Gateway>>(
      getRepositoryToken(Gateway),
    );
    gatewayLogRepository = module.get<Repository<GatewayLog>>(
      getRepositoryToken(GatewayLog),
    );
    peripheralDeviceRepository = module.get<Repository<PeripheralDevice>>(
      getRepositoryToken(PeripheralDevice),
    );
  });

  describe('createGateway', () => {
    it('should create a new gateway', async () => {
      const createGatewayDto: CreateGatewayDto = {
        serial_number: 'GW-001-TEST',
        name: 'Test Gateway',
        ipv4_address: '192.168.1.100',
        status: GatewayStatus.ACTIVE,
        location: 'Test Location',
      };

      const expectedResponse: GatewayResponseDto = {
        id: mockGateway.id,
        serial_number: mockGateway.serial_number,
        name: mockGateway.name,
        ipv4_address: mockGateway.ipv4_address,
        status: mockGateway.status,
        location: mockGateway.location,
        created_at: mockGateway.created_at,
        updated_at: mockGateway.updated_at,
        tenant_id: mockGateway.tenant_id,
      };

      jest.spyOn(gatewayRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(gatewayRepository, 'create').mockReturnValue(mockGateway);
      jest.spyOn(gatewayRepository, 'save').mockResolvedValue(mockGateway);
      jest
        .spyOn(gatewayLogRepository, 'create')
        .mockReturnValue({} as GatewayLog);
      jest
        .spyOn(gatewayLogRepository, 'save')
        .mockResolvedValue({} as GatewayLog);

      const result = await service.createGateway(createGatewayDto);

      expect(result).toEqual(expectedResponse);
      expect(gatewayRepository.findOne).toHaveBeenCalledTimes(2); // Check serial and IP uniqueness
      expect(gatewayRepository.create).toHaveBeenCalledWith(createGatewayDto);
      expect(gatewayRepository.save).toHaveBeenCalledWith(mockGateway);
    });

    it('should throw ConflictException for duplicate serial number', async () => {
      const createGatewayDto: CreateGatewayDto = {
        serial_number: 'GW-001-TEST',
        name: 'Test Gateway',
        ipv4_address: '192.168.1.100',
      };

      jest
        .spyOn(gatewayRepository, 'findOne')
        .mockResolvedValueOnce(mockGateway);

      await expect(service.createGateway(createGatewayDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getAllGateways', () => {
    it('should return all gateways', async () => {
      const mockGateways = [mockGateway];
      const expectedResponse = [
        {
          id: mockGateway.id,
          serial_number: mockGateway.serial_number,
          name: mockGateway.name,
          ipv4_address: mockGateway.ipv4_address,
          status: mockGateway.status,
          location: mockGateway.location,
          created_at: mockGateway.created_at,
          updated_at: mockGateway.updated_at,
          tenant_id: mockGateway.tenant_id,
        },
      ];

      jest.spyOn(gatewayRepository, 'find').mockResolvedValue(mockGateways);

      const result = await service.getAllGateways();

      expect(result).toEqual(expectedResponse);
      expect(gatewayRepository.find).toHaveBeenCalledWith({
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('getGatewayById', () => {
    it('should return a gateway by id', async () => {
      const expectedResponse = {
        id: mockGateway.id,
        serial_number: mockGateway.serial_number,
        name: mockGateway.name,
        ipv4_address: mockGateway.ipv4_address,
        status: mockGateway.status,
        location: mockGateway.location,
        created_at: mockGateway.created_at,
        updated_at: mockGateway.updated_at,
        tenant_id: mockGateway.tenant_id,
      };

      jest.spyOn(gatewayRepository, 'findOne').mockResolvedValue(mockGateway);

      const result = await service.getGatewayById(mockGateway.id);

      expect(result).toEqual(expectedResponse);
      expect(gatewayRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockGateway.id },
      });
    });

    it('should throw ConflictException when gateway not found', async () => {
      jest.spyOn(gatewayRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getGatewayById('nonexistent-id')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateGateway', () => {
    it('should update gateway details', async () => {
      const updateGatewayDto: UpdateGatewayDto = {
        name: 'Updated Gateway Name',
        location: 'Updated Location',
      };

      const updatedGateway = { ...mockGateway, ...updateGatewayDto };
      const expectedResponse = {
        id: updatedGateway.id,
        serial_number: updatedGateway.serial_number,
        name: updatedGateway.name,
        ipv4_address: updatedGateway.ipv4_address,
        status: updatedGateway.status,
        location: updatedGateway.location,
        created_at: updatedGateway.created_at,
        updated_at: updatedGateway.updated_at,
        tenant_id: updatedGateway.tenant_id,
      };

      jest.spyOn(gatewayRepository, 'findOne').mockResolvedValue(mockGateway);
      jest.spyOn(gatewayRepository, 'save').mockResolvedValue(updatedGateway);
      jest
        .spyOn(gatewayLogRepository, 'create')
        .mockReturnValue({} as GatewayLog);
      jest
        .spyOn(gatewayLogRepository, 'save')
        .mockResolvedValue({} as GatewayLog);

      const result = await service.updateGateway(
        mockGateway.id,
        updateGatewayDto,
      );

      expect(result).toEqual(expectedResponse);
      expect(gatewayRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateGatewayDto),
      );
    });
  });

  describe('addDeviceWithGateway', () => {
    it('should throw ConflictException when gateway has 10 devices', async () => {
      const gatewayWithMaxDevices = {
        ...mockGateway,
        devices: new Array(10).fill({}) as PeripheralDevice[],
      };

      jest
        .spyOn(gatewayRepository, 'findOne')
        .mockResolvedValue(gatewayWithMaxDevices);

      await expect(
        service.addDeviceWithGateway(mockGateway.id, 'device-id'),
      ).rejects.toThrow(ConflictException);
    });

    it('should successfully add device to gateway', async () => {
      const deviceId = 'device-123';
      const mockDevice = {
        id: deviceId,
        uid: 1001,
        vendor: 'Test Vendor',
        gateway_id: undefined,
      } as PeripheralDevice;

      const gatewayWithDevices = {
        ...mockGateway,
        devices: [],
      };

      jest
        .spyOn(gatewayRepository, 'findOne')
        .mockResolvedValueOnce(gatewayWithDevices)
        .mockResolvedValueOnce(mockGateway);
      jest
        .spyOn(peripheralDeviceRepository, 'findOne')
        .mockResolvedValue(mockDevice);
      jest
        .spyOn(peripheralDeviceRepository, 'save')
        .mockResolvedValue(mockDevice);
      jest
        .spyOn(gatewayLogRepository, 'create')
        .mockReturnValue({} as GatewayLog);
      jest
        .spyOn(gatewayLogRepository, 'save')
        .mockResolvedValue({} as GatewayLog);

      const result = await service.addDeviceWithGateway(
        mockGateway.id,
        deviceId,
      );

      expect(result).toBeDefined();
      expect(peripheralDeviceRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ gateway_id: mockGateway.id }),
      );
    });
  });
});
