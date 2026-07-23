import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Admin } from "../../models/admin.js";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const login = async (req, res, next) => {
  try {
    const email = req.body.email
      .trim()
      .toLowerCase();

    const admin = await Admin.findOne({
      email,
      isActive: true,
    }).select("+passwordHash");

    if (!admin) {
      const error = new Error(
        "Email or password is incorrect",
      );
      error.status = 401;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      admin.passwordHash,
    );

    if (!isPasswordCorrect) {
      const error = new Error(
        "Email or password is incorrect",
      );
      error.status = 401;
      throw error;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      {
        role: admin.role,
      },
      jwtSecret,
      {
        subject: admin._id.toString(),
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    const isProduction =
      process.env.NODE_ENV === "production";

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    res.status(200).json({
      status: "success",
      data: {
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};