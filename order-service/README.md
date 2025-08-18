# Order Service Documentation

## Overview
The Order Service is a microservice responsible for managing orders in the application. It provides endpoints to create, retrieve, and manage orders, and it communicates with the User Service to fetch user details associated with each order.

## Features
- Create new orders
- Retrieve order details
- List all orders for a user
- Integration with User Service to fetch user information

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- TypeScript (optional, for development)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd microservices/order-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Configuration
- Ensure that the User Service is running, as the Order Service depends on it for user-related operations.
- Update any necessary environment variables in a `.env` file or directly in the code.

### Running the Service
To start the Order Service, run:
```
npm start
```
This will compile the TypeScript files and start the Express server.

### API Endpoints
- **POST /orders**: Create a new order.
- **GET /orders/:id**: Retrieve an order by ID.
- **GET /orders/user/:userId**: List all orders for a specific user.

### Testing
You can run tests using:
```
npm test
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the contributors and the community for their support and feedback.