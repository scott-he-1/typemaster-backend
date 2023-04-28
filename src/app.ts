import express from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import { textController } from "./router/text.router";
import { scoreController } from "./router/score.router";
import { authController } from "./router/auth.router";
import { userController } from "./router/user.router";

dotenv.config();

["DATABASE_URL", "JWT_SECRET", "PORT"].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable ${key}`);
  }
});

const port = process.env["PORT"];
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Hello world!");
});

app.use(userController);
app.use(authController);
app.use(textController);
app.use(scoreController);

app.listen(port, () => console.log(`Server is running on port ${port}`));
