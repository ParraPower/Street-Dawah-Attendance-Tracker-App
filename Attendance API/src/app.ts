// src/app.ts
import express from "express";
// import helmet from "helmet";
// import morgan from "morgan";
import userRouter from "./domains/user/routes/user-routes.js"; // .js for NodeNext runtime
import importRouter from "./domains/import/routes/import-routes.js"; // .js for NodeNext runtime
//import { errorHandler } from "./middleware/errorHandler.js";
//import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { authenticate } from "./middleware/authenticate.js";
import { authorize } from "./middleware/authorize.js";
//import rateLimit from "express-rate-limit";

const app = express();

// Global middleware
//app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(morgan(process.env.LOG_FORMAT ?? "dev"));

// // Example scoped middleware for /user routes (apply here to keep router clean)
// const userRateLimiter = rateLimit({
//   windowMs: 60_000,
//   max: 120,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// Mount user router under /user so all endpoints start with /user
//app.use("/user", authenticate, authorize,/* userRateLimiter,*/ userRouter);


// Mount import router under /import so all endpoints start with /import
app.use("/import", /*authenticate, authorize,*//* userRateLimiter,*/ importRouter);

// // 404 handler
// app.use(notFoundHandler);

// // Centralized error handler (must be last)
// app.use(errorHandler);

export default app;
