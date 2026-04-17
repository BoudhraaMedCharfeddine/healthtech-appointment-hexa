import { DataSource } from 'typeorm';
import { AppointmentOrmEntity } from './appointment.orm-entity';

export const createTestDataSource = () =>
  new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'healthtech',
    password: process.env.DB_PASSWORD || 'healthtech',
    database: process.env.DB_NAME || 'healthtech',
    entities: [AppointmentOrmEntity],
    synchronize: true,
    dropSchema: true,
  });