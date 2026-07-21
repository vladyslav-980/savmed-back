import {Router} from "express";
import { getHealth } from "../controllers/health/getHealth.js";

const healthRouter = Router();

healthRouter.get("/", getHealth);

export default healthRouter;