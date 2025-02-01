import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';

// main().catch((err) => console.log(err));
let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`Blog app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`unhandledRejection is detected. server is shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected. server is shutting down...`);
  process.exit(1);
});
