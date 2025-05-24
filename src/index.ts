import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import router from "./routes";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Routes
app.use(router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
