import {
  DeviceStatus,
  DeviceType,
  Gateway,
  GatewayStatus,
  PeripheralDevice,
  Tenant,
} from '../../entities';
import { AppDataSource } from '../data-source';

async function seedTestData() {
  try {
    // Initialize the data source
    await AppDataSource.initialize();

    // Clear existing data
    await AppDataSource.query('TRUNCATE TABLE gateway_logs CASCADE');
    await AppDataSource.query('TRUNCATE TABLE peripheral_devices CASCADE');
    await AppDataSource.query('TRUNCATE TABLE gateways CASCADE');
    await AppDataSource.query('TRUNCATE TABLE tenants CASCADE');

    // Get device types
    const deviceTypeRepository = AppDataSource.getRepository(DeviceType);
    const sensorType = await deviceTypeRepository.findOne({
      where: { name: 'sensor' },
    });
    const actuatorType = await deviceTypeRepository.findOne({
      where: { name: 'actuator' },
    });
    const controllerType = await deviceTypeRepository.findOne({
      where: { name: 'controller' },
    });

    if (!sensorType || !actuatorType || !controllerType) {
      throw new Error('Device types not found. Please run migrations first.');
    }

    // Create tenants
    const tenantRepository = AppDataSource.getRepository(Tenant);

    const tenant1 = tenantRepository.create({
      name: 'Acme Corporation',
      contact_email: 'admin@acme.com',
    });

    const tenant2 = tenantRepository.create({
      name: 'Tech Solutions Ltd',
      contact_email: 'contact@techsolutions.com',
    });

    const savedTenants = await tenantRepository.save([tenant1, tenant2]);

    // Create gateways
    const gatewayRepository = AppDataSource.getRepository(Gateway);

    const gateway1 = gatewayRepository.create({
      serial_number: 'GW-001-ABC123',
      name: 'Main Building Gateway',
      ipv4_address: '192.168.1.100',
      status: GatewayStatus.ACTIVE,
      location: 'Building A, Floor 1, Server Room',
      tenant_id: savedTenants[0].id,
    });

    const gateway2 = gatewayRepository.create({
      serial_number: 'GW-002-DEF456',
      name: 'Factory Floor Gateway',
      ipv4_address: '192.168.2.100',
      status: GatewayStatus.ACTIVE,
      location: 'Factory Floor, Section B',
      tenant_id: savedTenants[0].id,
    });

    const gateway3 = gatewayRepository.create({
      serial_number: 'GW-003-GHI789',
      name: 'Warehouse Gateway',
      ipv4_address: '192.168.3.100',
      status: GatewayStatus.INACTIVE,
      location: 'Warehouse, Zone A',
      tenant_id: savedTenants[1].id,
    });

    const savedGateways = await gatewayRepository.save([
      gateway1,
      gateway2,
      gateway3,
    ]);

    // Create peripheral devices
    const deviceRepository = AppDataSource.getRepository(PeripheralDevice);

    const devices = [
      // Devices for Gateway 1
      {
        uid: 1001,
        vendor: 'Siemens',
        status: DeviceStatus.ONLINE,
        device_type_id: sensorType.id,
        gateway_id: savedGateways[0].id,
      },
      {
        uid: 1002,
        vendor: 'Honeywell',
        status: DeviceStatus.ONLINE,
        device_type_id: actuatorType.id,
        gateway_id: savedGateways[0].id,
      },
      {
        uid: 1003,
        vendor: 'ABB',
        status: DeviceStatus.OFFLINE,
        device_type_id: controllerType.id,
        gateway_id: savedGateways[0].id,
      },
      // Devices for Gateway 2
      {
        uid: 2001,
        vendor: 'Schneider Electric',
        status: DeviceStatus.ONLINE,
        device_type_id: sensorType.id,
        gateway_id: savedGateways[1].id,
      },
      {
        uid: 2002,
        vendor: 'Rockwell Automation',
        status: DeviceStatus.MAINTENANCE,
        device_type_id: actuatorType.id,
        gateway_id: savedGateways[1].id,
      },
      {
        uid: 2003,
        vendor: 'Emerson',
        status: DeviceStatus.ONLINE,
        device_type_id: sensorType.id,
        gateway_id: savedGateways[1].id,
      },
      {
        uid: 2004,
        vendor: 'GE Digital',
        status: DeviceStatus.ONLINE,
        device_type_id: controllerType.id,
        gateway_id: savedGateways[1].id,
      },
      // Orphaned devices (no gateway assigned)
      {
        uid: 9001,
        vendor: 'Phoenix Contact',
        status: DeviceStatus.OFFLINE,
        device_type_id: sensorType.id,
        gateway_id: undefined,
      },
      {
        uid: 9002,
        vendor: 'Beckhoff',
        status: DeviceStatus.OFFLINE,
        device_type_id: actuatorType.id,
        gateway_id: undefined,
      },
    ];

    const deviceEntities = devices.map((device) =>
      deviceRepository.create({
        ...device,
        last_seen_at:
          device.status === DeviceStatus.ONLINE ? new Date() : undefined,
      }),
    );

    await deviceRepository.save(deviceEntities);

    console.log('✅ Test data seeded successfully!');
    console.log(`📊 Created ${savedTenants.length} tenants`);
    console.log(`🚪 Created ${savedGateways.length} gateways`);
    console.log(`🔌 Created ${deviceEntities.length} devices`);
    console.log(
      `   - ${devices.filter((d) => d.gateway_id).length} assigned to gateways`,
    );
    console.log(
      `   - ${devices.filter((d) => !d.gateway_id).length} orphaned devices`,
    );

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  void seedTestData();
}

export { seedTestData };
