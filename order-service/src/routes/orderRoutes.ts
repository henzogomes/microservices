import { Express } from "express";
import { OrderController } from "../controllers/orderController";

const orderController = new OrderController();

export function setOrderRoutes(app: Express) {
  app.post("/orders", orderController.createOrder.bind(orderController));
  app.get("/orders", orderController.getOrders.bind(orderController));
  app.get("/orders/:id", orderController.getOrder.bind(orderController));
  app.get(
    "/orders/:id/with-user",
    orderController.getOrderWithUser.bind(orderController)
  );
  app.put("/orders/:id", orderController.updateOrder.bind(orderController));
  app.delete("/orders/:id", orderController.deleteOrder.bind(orderController));
}
