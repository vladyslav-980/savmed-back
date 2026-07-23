import { rateLimit } from "express-rate-limit";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export const loginRateLimiter = rateLimit({
  windowMs: LOGIN_WINDOW_MS,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many login attempts. Please try again later",
  },
});