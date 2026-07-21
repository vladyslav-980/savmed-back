import "dotenv/config";

import app from "./app.js";

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`SavMed API is running on http://localhost:${port}`);
});