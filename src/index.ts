import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import router from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
