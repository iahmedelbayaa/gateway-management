import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1693734000000 implements MigrationInterface {
  name = 'InitialSchema1693734000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tenants table
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "contact_email" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_tenant_name" UNIQUE ("name"),
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id")
      );
    `);

    // Create device_types table
    await queryRunner.query(`
      CREATE TABLE "device_types" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        CONSTRAINT "UQ_device_type_name" UNIQUE ("name"),
        CONSTRAINT "PK_device_types" PRIMARY KEY ("id")
      );
    `);

    // Create gateways table
    await queryRunner.query(`
      CREATE TYPE "gateway_status_enum" AS ENUM('active', 'inactive', 'decommissioned');
      
      CREATE TABLE "gateways" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "serial_number" character varying NOT NULL,
        "name" character varying NOT NULL,
        "ipv4_address" character varying NOT NULL,
        "status" "gateway_status_enum" NOT NULL DEFAULT 'active',
        "location" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "tenant_id" uuid,
        CONSTRAINT "UQ_gateway_serial_number" UNIQUE ("serial_number"),
        CONSTRAINT "UQ_gateway_ipv4_address" UNIQUE ("ipv4_address"),
        CONSTRAINT "PK_gateways" PRIMARY KEY ("id"),
        CONSTRAINT "FK_gateway_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL
      );
    `);

    // Create peripheral_devices table
    await queryRunner.query(`
      CREATE TYPE "device_status_enum" AS ENUM('online', 'offline', 'maintenance');
      
      CREATE TABLE "peripheral_devices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "uid" bigint NOT NULL,
        "vendor" character varying NOT NULL,
        "status" "device_status_enum" NOT NULL DEFAULT 'offline',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "last_seen_at" TIMESTAMP,
        "gateway_id" uuid,
        "device_type_id" integer NOT NULL,
        CONSTRAINT "UQ_device_uid" UNIQUE ("uid"),
        CONSTRAINT "PK_peripheral_devices" PRIMARY KEY ("id"),
        CONSTRAINT "FK_device_gateway" FOREIGN KEY ("gateway_id") REFERENCES "gateways"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_device_type" FOREIGN KEY ("device_type_id") REFERENCES "device_types"("id") ON DELETE RESTRICT
      );
    `);

    // Create gateway_logs table
    await queryRunner.query(`
      CREATE TABLE "gateway_logs" (
        "id" bigserial NOT NULL,
        "gateway_id" uuid NOT NULL,
        "action" character varying NOT NULL,
        "details" jsonb NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_gateway_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_log_gateway" FOREIGN KEY ("gateway_id") REFERENCES "gateways"("id") ON DELETE CASCADE
      );
    `);

    // Insert initial device types
    await queryRunner.query(`
      INSERT INTO "device_types" ("name", "description") VALUES
      ('sensor', 'Environmental or data collection sensors'),
      ('actuator', 'Control devices that perform physical actions'),
      ('controller', 'Logic control and processing devices'),
      ('display', 'Information display devices'),
      ('communication', 'Communication and networking devices');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "gateway_logs"`);
    await queryRunner.query(`DROP TABLE "peripheral_devices"`);
    await queryRunner.query(`DROP TYPE "device_status_enum"`);
    await queryRunner.query(`DROP TABLE "gateways"`);
    await queryRunner.query(`DROP TYPE "gateway_status_enum"`);
    await queryRunner.query(`DROP TABLE "device_types"`);
    await queryRunner.query(`DROP TABLE "tenants"`);
  }
}
