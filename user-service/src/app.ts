import express from "express";
import { setUserRoutes } from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setUserRoutes(app);

// Add this health check endpoint before your existing routes
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "user-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`User service is running on http://localhost:${PORT}`);
});
