import { errors } from "celebrate";
import cors from "cors";
import express from "express";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import availabilityRouter from "./routes/availabilityRouter.js";
import healthRouter from "./routes/healthRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/availability", availabilityRouter);

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

export default app;