import express from "express";
import cors from "cors";

import router from "./routes";
import { PORT } from "./config";
import { errorHandler } from "./middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
