# Microservices Project

This project demonstrates a microservices architecture using Node.js, TypeScript, and Express. It consists of three main components: a User Service, an Order Service, and an API Gateway that orchestrates communication between services.

## Services Overview

### API Gateway (Port 3002)
- **Purpose**: Entry point for all client requests. Routes requests to appropriate services and provides features like circuit breaker, health monitoring, and request proxying.
- **Features**:
  - Circuit breaker pattern for fault tolerance
  - Health monitoring of downstream services
  - Rate limiting and security middleware
  - Request routing and load balancing

### User Service (Port 3000)
- **Purpose**: Manages user-related operations such as creating, retrieving, and updating user information.
- **Endpoints**:
  - `POST /users`: Create a new user
  - `GET /users/:id`: Retrieve a user by ID
  - `GET /users`: Retrieve all users
  - `PUT /users/:id`: Update a user by ID
  - `DELETE /users/:id`: Delete a user by ID
  - `GET /health`: Health check endpoint

### Order Service (Port 3001)
- **Purpose**: Manages order-related operations, including creating and retrieving orders. Communicates with User Service for user validation.
- **Endpoints**:
  - `POST /orders`: Create a new order
  - `GET /orders/:id`: Retrieve an order by ID
  - `GET /orders`: Retrieve all orders
  - `GET /health`: Health check endpoint

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd microservices
```

### 2. Install Dependencies
Navigate to each service directory and install dependencies:

```bash
# Install API Gateway dependencies
cd api-gateway
npm install

# Install User Service dependencies
cd ../user-service
npm install

# Install Order Service dependencies
cd ../order-service
npm install
```

### 3. Start the Services
You need to start all three services in development mode. Open **three separate terminal windows/tabs** and run:

**Terminal 1 - User Service:**
```bash
cd user-service
npm run dev
```

**Terminal 2 - Order Service:**
```bash
cd order-service
npm run dev
```

**Terminal 3 - API Gateway:**
```bash
cd api-gateway
npm run dev
```

### 4. Verify Services are Running
Once all services are started, you should see:
- User Service running on `http://localhost:3000`
- Order Service running on `http://localhost:3001`
- API Gateway running on `http://localhost:3002`

You can verify by checking the health endpoints:
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## Making Requests

### Through API Gateway (Recommended)
All requests should go through the API Gateway at `http://localhost:3002`:

```bash
# Create a user
curl -X POST http://localhost:3002/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get a user
curl http://localhost:3002/users/1

# Create an order
curl -X POST http://localhost:3002/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "product": "Laptop", "quantity": 1}'

# Get all orders
curl http://localhost:3002/orders
```

### Direct Service Access (For Development/Testing)
You can also access services directly:

**User Service (Port 3000):**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'
```

**Order Service (Port 3001):**
```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "product": "Phone", "quantity": 2}'
```

## Communication Between Services

The Order Service communicates with the User Service to retrieve user information when processing orders. The API Gateway acts as a single entry point and routes requests to the appropriate services, providing additional features like circuit breaking and health monitoring.

## Important Notes

- **Service Startup Order**: You must start all three services before making requests. Each service runs independently on its own port.
- **Dependencies**: Make sure to run `npm install` in each service directory before starting the services.
- **API Gateway**: All client requests should go through the API Gateway (port 3002) for proper routing and circuit breaking functionality.

## Conclusion

This microservices project serves as a foundational example for building scalable applications using Node.js, TypeScript, and Express. The architecture demonstrates key microservices patterns including service isolation, API gateway pattern, circuit breaker for fault tolerance, and inter-service communication. You can extend the functionality by adding more services or features as needed.