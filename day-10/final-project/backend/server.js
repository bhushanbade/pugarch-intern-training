import 'dotenv/config';
import { createApp } from './app.js';
import { createPool } from './config/database.js';

const pool = createPool();
const app = createApp(pool);
const port = Number(process.env.PORT ?? 5000);

const server = app.listen(port, () => {
  console.log(`FacilityOps API listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down FacilityOps API.`);
  server.close(async (error) => {
    try {
      await pool.end();
    } catch (closeError) {
      console.error('Failed to close the MySQL pool cleanly.', closeError);
      process.exitCode = 1;
    }
    if (error) {
      console.error('Failed to close the HTTP server cleanly.', error);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
