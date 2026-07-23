import { celebrate } from "celebrate";
import { Router } from "express";

import { getCurrentAdmin } from "../controllers/auth/getCurrentAdmin.js";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { authenticateDoctor } from "../middlewares/authenticateDoctor.js";
import { loginRateLimiter } from "../middlewares/loginRateLimiter.js";
import { loginSchema } from "../validations/auth.js";

const authRouter = Router();

authRouter.post(
  "/login",
  loginRateLimiter,
  celebrate(loginSchema),
  login,
);

authRouter.get(
  "/me",
  authenticateDoctor,
  getCurrentAdmin,
);

authRouter.post(
  "/logout",
  authenticateDoctor,
  logout,
);

export default authRouter;