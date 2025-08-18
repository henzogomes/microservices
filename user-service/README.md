# User Service

This is the User Service of the microservices architecture. It is responsible for managing user-related operations such as creating, retrieving, and updating user information.

## Getting Started

To set up the User Service, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd microservices/user-service
   ```

2. **Install dependencies**:
   Make sure you have Node.js and npm installed. Then run:
   ```bash
   npm install
   ```

3. **Run the service**:
   You can start the service using:
   ```bash
   npm start
   ```

   The service will be available at `http://localhost:3000`.

## API Endpoints

### User Endpoints

- **POST /users**: Create a new user.
- **GET /users/:id**: Retrieve a user by ID.
- **PUT /users/:id**: Update a user by ID.

## Folder Structure

- `src/`: Contains the source code for the user service.
  - `app.ts`: Entry point of the application.
  - `controllers/`: Contains the user controller.
  - `routes/`: Contains the user routes.
  - `models/`: Contains the user model.
  - `types/`: Contains TypeScript types and interfaces.

## Technologies Used

- Node.js
- TypeScript
- Express

## License

This project is licensed under the MIT License.