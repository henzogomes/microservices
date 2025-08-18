import { Router } from 'express';
import { UserController } from '../controllers/userController';

const userController = new UserController();
const router = Router();

export function setUserRoutes(app: Router) {
    app.post('/users', userController.createUser.bind(userController));
    app.get('/users/:id', userController.getUser.bind(userController));
    app.put('/users/:id', userController.updateUser.bind(userController));
}