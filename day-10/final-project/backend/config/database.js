import mysql from 'mysql2/promise';

export function createPool(config = process.env) {
  return mysql.createPool({
    host: config.DB_HOST ?? 'localhost',
    port: Number(config.DB_PORT ?? 3306),
    database: config.DB_NAME ?? 'facility_ops',
    user: config.DB_USER ?? 'root',
    password: config.DB_PASSWORD ?? '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  });
}
