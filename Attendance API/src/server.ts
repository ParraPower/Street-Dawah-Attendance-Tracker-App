// src/server.ts
import "reflect-metadata";
//import { createDataSource } from "./data-source.js";
import AppDataSource from "./data-source.js";
import app from "./app.js";

const PORT = Number(process.env.PORT ?? 3000);

async function bootstrap() {
  try {
    // Initialize DB (deferred creation in data-source.ts)
    // const dataSource = createDataSource();
    // await dataSource.initialize();

    AppDataSource.initialize();

    console.log("DataSource initialized");

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to bootstrap app:", err);
    process.exit(1);
  }
}

bootstrap();
