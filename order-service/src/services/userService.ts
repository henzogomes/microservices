import axios from "axios";

export class UserService {
  private userServiceUrl =
    process.env.USER_SERVICE_URL || "http://localhost:3000";

  async getUserById(userId: string) {
    try {
      const response = await axios.get(
        `${this.userServiceUrl}/users/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      throw new Error("User service unavailable");
    }
  }

  async validateUser(userId: string): Promise<boolean> {
    try {
      await this.getUserById(userId);
      return true;
    } catch (error) {
      return false;
    }
  }
}
