import express from "express";
import cors from "cors";

import router from "./routes";
import { PORT } from "./config";
import { errorHandler } from "./middleware";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
