import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import { initDB } from "./db/connection.js";
import path from "node:path";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(
  "/avatars",
  express.static(path.join(process.cwd(), "public", "avatars"))
);
app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  console.log(err);
  res.status(status).json({ message });
});

initDB().then(() => {
  app.listen(3000, () => {
    console.log("Server is running. Use our API on port: 3000");
  });
});
