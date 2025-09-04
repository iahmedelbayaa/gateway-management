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
import { GatewayService } from '../services/gateway.service';
import {
  CreateGatewayDto,
  GatewayResponseDto,
  UpdateGatewayDto,
} from '../dtos';
import { Gateway } from '../entities';

@ApiTags('gateways')
@Controller('gateways')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gateway' })
  @ApiBody({ type: CreateGatewayDto })
  @ApiResponse({
    status: 201,
    description: 'Gateway successfully created',
    type: Gateway,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 409,
    description: 'Gateway with serial number or IP already exists',
  })
  createGateway(
    @Body() createGatewayDto: CreateGatewayDto,
  ): Promise<GatewayResponseDto> {
    return this.gatewayService.createGateway(createGatewayDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gateways with their devices' })
  @ApiResponse({
    status: 200,
    description: 'List of all gateways',
    type: [Gateway],
  })
  findAllGateways(): Promise<GatewayResponseDto[]> {
    return this.gatewayService.getAllGateways();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gateway details by ID' })
  @ApiParam({ name: 'id', description: 'Gateway UUID' })
  @ApiResponse({
    status: 200,
    description: 'Gateway details with devices and logs',
    type: Gateway,
  })
  @ApiResponse({ status: 404, description: 'Gateway not found' })
  findOneGateway(@Param('id') id: string): Promise<GatewayResponseDto> {
    return this.gatewayService.getGatewayById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gateway details (except serial number)' })
  @ApiParam({ name: 'id', description: 'Gateway UUID' })
  @ApiBody({ type: UpdateGatewayDto })
  @ApiResponse({
    status: 200,
    description: 'Gateway successfully updated',
    type: Gateway,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Gateway not found' })
  @ApiResponse({
    status: 409,
    description: 'Gateway with IP already exists',
  })
  updateGateway(
    @Param('id') id: string,
    @Body() updateGatewayDto: UpdateGatewayDto,
  ): Promise<GatewayResponseDto> {
    return this.gatewayService.updateGateway(id, updateGatewayDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete gateway (devices become orphaned)',
  })
  @ApiParam({ name: 'id', description: 'Gateway UUID' })
  @ApiResponse({ status: 204, description: 'Gateway successfully deleted' })
  @ApiResponse({ status: 404, description: 'Gateway not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeGateway(@Param('id') id: string): Promise<void> {
    await this.gatewayService.deleteGateway(id);
  }

  @Post(':id/devices/:deviceId')
  @ApiOperation({ summary: 'Attach a device to a gateway' })
  @ApiParam({ name: 'id', description: 'Gateway UUID' })
  @ApiParam({ name: 'deviceId', description: 'Device UUID' })
  @ApiResponse({
    status: 200,
    description: 'Device successfully attached to gateway',
    type: Gateway,
  })
  @ApiResponse({ status: 400, description: 'Gateway device limit exceeded' })
  @ApiResponse({ status: 404, description: 'Gateway or device not found' })
  addDeviceWithGateway(
    @Param('id') gatewayId: string,
    @Param('deviceId') deviceId: string,
  ): Promise<GatewayResponseDto> {
    return this.gatewayService.addDeviceWithGateway(gatewayId, deviceId);
  }

  @Delete(':id/devices/:deviceId')
  @ApiOperation({ summary: 'Remove a device from a gateway' })
  @ApiParam({ name: 'id', description: 'Gateway UUID' })
  @ApiParam({ name: 'deviceId', description: 'Device UUID' })
  @ApiResponse({
    status: 200,
    description: 'Device successfully removed from gateway',
    type: Gateway,
  })
  @ApiResponse({
    status: 404,
    description: 'Gateway or device not found in gateway',
  })
  removeDeviceWithGateway(
    @Param('id') gatewayId: string,
    @Param('deviceId') deviceId: string,
  ): Promise<GatewayResponseDto> {
    return this.gatewayService.removeDeviceWithGateway(gatewayId, deviceId);
  }
}
