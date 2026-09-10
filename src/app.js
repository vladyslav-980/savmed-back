import { errors } from "celebrate";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import appointmentsRouter from "./routes/appointmentsRouter.js";
import authRouter from "./routes/authRouter.js";
import availabilityRouter from "./routes/availabilityRouter.js";
import healthRouter from "./routes/healthRouter.js";

const app = express();

const frontendUrls = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  "http://localhost:3000"
)
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || frontendUrls.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
        return;
      }

      const error = new Error("Origin is not allowed by CORS");
      error.status = 403;
      callback(error);
    },
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "100kb",
  }),
);

app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/appointments", appointmentsRouter);

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
