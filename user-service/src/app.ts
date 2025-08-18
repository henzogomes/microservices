import express from "express";
import { setUserRoutes } from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setUserRoutes(app);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "User Service is running", port: 3000 });
});

app.listen(PORT, () => {
  console.log(`User service is running on http://localhost:${PORT}`);
});
