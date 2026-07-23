import jwt from "jsonwebtoken";

import { Admin } from "../models/admin.js";

export const authenticateDoctor = async (
  req,
  res,
  next,
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      const error = new Error(
        "Authentication is required",
      );
      error.status = 401;
      throw error;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    let payload;

    try {
      payload = jwt.verify(token, jwtSecret);
    } catch {
      const error = new Error(
        "Authentication token is invalid or expired",
      );
      error.status = 401;
      throw error;
    }

    if (payload.role !== "doctor") {
      const error = new Error(
        "Doctor access is required",
      );
      error.status = 403;
      throw error;
    }

    const admin = await Admin.findOne({
      _id: payload.sub,
      isActive: true,
    });

    if (!admin) {
      const error = new Error(
        "Doctor account is unavailable",
      );
      error.status = 401;
      throw error;
    }

    req.admin = admin;

    next();
  } catch (error) {
    next(error);
  }
};