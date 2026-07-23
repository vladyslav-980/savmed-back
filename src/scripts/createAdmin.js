import "dotenv/config";

import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { connectMongoDB } from "../db/connectMongoDB.js";
import { Admin } from "../models/admin.js";

const SALT_ROUNDS = 12;

const createAdmin = async () => {
  try {
    const {
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
    } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required",
      );
    }

    await connectMongoDB();

    const normalizedEmail = ADMIN_EMAIL
      .trim()
      .toLowerCase();

    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      throw new Error(
        "Admin with this email already exists",
      );
    }

    const passwordHash = await bcrypt.hash(
      ADMIN_PASSWORD,
      SALT_ROUNDS,
    );

    await Admin.create({
      name: ADMIN_NAME,
      email: normalizedEmail,
      passwordHash,
      role: "doctor",
    });

    console.log("Doctor admin created successfully");
  } catch (error) {
    console.error(
      "Failed to create doctor admin:",
      error.message,
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();