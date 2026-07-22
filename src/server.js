import "dotenv/config";

import app from "./app.js";
import { connectMongoDB } from "./db/connectMongoDB.js";

const port = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectMongoDB();

    app.listen(port, () => {
      console.log(`SavMed API is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();