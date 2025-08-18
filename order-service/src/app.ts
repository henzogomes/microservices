import express from "express";
import { setOrderRoutes } from "./routes/orderRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

setOrderRoutes(app);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "Order Service is running", port: 3001 });
});

app.listen(PORT, () => {
  console.log(`Order service is running on port ${PORT}`);
});
