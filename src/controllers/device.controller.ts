import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DeviceService } from '../services/device.service';
import { CreateDeviceDto, DeviceResponseDto, UpdateDeviceDto } from '../dtos';
import { PeripheralDevice } from '../entities';

@ApiTags('devices')
@Controller('devices')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new peripheral device' })
  @ApiBody({ type: CreateDeviceDto })
  @ApiResponse({
    status: 201,
    description: 'Device successfully created',
    type: PeripheralDevice,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 409,
    description: 'Device with UID already exists',
  })
  create(@Body() createDeviceDto: CreateDeviceDto): Promise<DeviceResponseDto> {
    return this.deviceService.addDevice(createDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({
    status: 200,
    description: 'List of all devices',
    type: [PeripheralDevice],
  })
  findAll(): Promise<DeviceResponseDto[]> {
    return this.deviceService.getAllDevices();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device details by ID' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiResponse({
    status: 200,
    description: 'Device details',
    type: PeripheralDevice,
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  findOne(@Param('id') id: string): Promise<DeviceResponseDto> {
    return this.deviceService.getDeviceById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update device details' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiBody({ type: UpdateDeviceDto })
  @ApiResponse({
    status: 200,
    description: 'Device successfully updated',
    type: PeripheralDevice,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceResponseDto> {
    return this.deviceService.updateDevice(id, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete device' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiResponse({ status: 204, description: 'Device successfully deleted' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.deviceService.deleteDevice(id);
  }
}
