import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import AIrouter from "./services/ai.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, we are Moodify 🚀");
});

app.use("/", authRoutes);
app.use("/ai", AIrouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
