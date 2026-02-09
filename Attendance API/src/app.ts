import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "@/domains/user/routes/user-routes"; //  for NodeNext runtime
import importRouter from "@/domains/import/routes/import-routes"; //  for NodeNext runtime
import exportRouter from  "@/domains/import/routes/export-routes"
//import { errorHandler } from "./middleware/errorHandler";
//import { notFoundHandler } from "./middleware/notFoundHandler";
import { env } from "@/config/env";
import { registerProfiles } from "./mapping/register-profiles";

export const app = express();

registerProfiles();

// Global middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.logFormat ?? "dev"));

app.use("/user", userRouter);
app.use("/import", importRouter);
app.use("/export", exportRouter);


// // 404 handler
// app.use(notFoundHandler);

// // Centralized error handler (must be last)
// app.use(errorHandler);
