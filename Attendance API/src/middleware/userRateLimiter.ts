import rateLimit from "express-rate-limit";

// Example scoped middleware for /user routes (apply here to keep router clean)
export const userRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});