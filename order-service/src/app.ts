import express from "express";
import { setOrderRoutes } from "./routes/orderRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Add this health check endpoint before your existing routes
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "order-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

setOrderRoutes(app);

app.listen(PORT, () => {
  console.log(`Order service is running on port ${PORT}`);
});
