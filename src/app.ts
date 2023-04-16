import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import logger from "./utils/logger";
import "./scheduledJobs/sendReminders";
import contactsRoutes from "./routes/contactsRoutes";
import { register, login } from "./controllers/userController";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error);
  });

app.post("/api/register", register);
app.post("/api/login", login);
app.use("/api/contacts", contactsRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
