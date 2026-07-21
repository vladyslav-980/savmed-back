import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SavMed API is working",
  });
});

app.listen(port, () => {
  console.log(`SavMed API is running on http://localhost:${port}`);
});