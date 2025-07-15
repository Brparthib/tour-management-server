/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log(`Connected To DB!!!`);

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  startServer();
  seedSuperAdmin();
})();

// unhandled rejection error handler
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection detected... Server shutting down... ", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// unhandled rejection error
// Promise.reject(new Error("I forgot to catch this promise"));

// uncaught exception error handler
process.on("uncaughtException", (err) => {
  console.log("uncaught exception detected... Server shutting down... ", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// uncaught exception error
// throw new Error("I forgot to handle this local error");

// signal termination handler
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down... ");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
