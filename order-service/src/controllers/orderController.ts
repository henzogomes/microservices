import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class OrderController {
  private userService = new UserService();

  async createOrder(req: Request, res: Response) {
    try {
      const { userId, productName, quantity, price } = req.body;

      // Validate user exists before creating order
      const userExists = await this.userService.validateUser(userId);
      if (!userExists) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const order = {
        id: Date.now(),
        userId,
        productName,
        quantity,
        price,
        createdAt: new Date(),
      };

      res.status(201).json({ message: "Order created", order });
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  }

  async getOrderWithUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get order details (normally from database)
      const order = {
        id,
        userId: "1",
        productName: "Laptop",
        quantity: 1,
        price: 999.99,
      };

      // Fetch user details from User Service
      const user = await this.userService.getUserById(order.userId);

      res.status(200).json({
        order,
        user: user.user || user,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get order with user details" });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      res.status(200).json({ message: `Order details for id: ${id}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to get order" });
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "List of all orders" });
    } catch (error) {
      res.status(500).json({ error: "Failed to get orders" });
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      res
        .status(200)
        .json({ message: `Order ${id} updated`, order: { id, ...updateData } });
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      res.status(200).json({ message: `Order ${id} deleted` });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  }
}
