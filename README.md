# Microservices Project

This project demonstrates a microservices architecture using Node.js, TypeScript, and Express. It consists of two services: a User Service and an Order Service. Each service is responsible for its own domain and communicates with each other via HTTP requests.

## Project Structure

```
microservices
├── user-service
│   ├── src
│   │   ├── app.ts
│   │   ├── controllers
│   │   │   └── userController.ts
│   │   ├── routes
│   │   │   └── userRoutes.ts
│   │   ├── models
│   │   │   └── User.ts
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── order-service
│   ├── src
│   │   ├── app.ts
│   │   ├── controllers
│   │   │   └── orderController.ts
│   │   ├── routes
│   │   │   └── orderRoutes.ts
│   │   ├── models
│   │   │   └── Order.ts
│   │   ├── services
│   │   │   └── userService.ts
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── docker-compose.yml
└── README.md
```

## Services Overview

### User Service
- **Purpose**: Manages user-related operations such as creating, retrieving, and updating user information.
- **Endpoints**:
  - `POST /users`: Create a new user
  - `GET /users/:id`: Retrieve a user by ID
  - `PUT /users/:id`: Update a user by ID

### Order Service
- **Purpose**: Manages order-related operations, including creating and retrieving orders.
- **Endpoints**:
  - `POST /orders`: Create a new order
  - `GET /orders/:id`: Retrieve an order by ID
  - `GET /orders`: Retrieve all orders

## Setup Instructions

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd microservices
   ```

2. **Install Dependencies**:
   For both services, navigate to each service directory and run:
   ```
   npm install
   ```

3. **Run the Services**:
   You can run the services individually or use Docker Compose to run them together. To use Docker Compose, run:
   ```
   docker-compose up
   ```

4. **Access the Services**:
   - User Service: `http://localhost:3000`
   - Order Service: `http://localhost:3001`

## Communication Between Services

The Order Service communicates with the User Service to retrieve user information when processing orders. This is done through HTTP requests, ensuring that each service remains independent and can be scaled separately.

## Conclusion

This microservices project serves as a foundational example for building scalable applications using Node.js, TypeScript, and Express. You can extend the functionality by adding more services or features as needed.