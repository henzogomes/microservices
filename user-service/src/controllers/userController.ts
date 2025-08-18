import { Request, Response } from 'express';

export class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const { name, email } = req.body;
            const user = { id: Date.now(), name, email };
            res.status(201).json({ message: 'User created', user });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            res.status(200).json({ message: `User details for id: ${id}` });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get user' });
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            res.status(200).json({ message: 'List of all users' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get users' });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email } = req.body;
            res.status(200).json({ message: `User ${id} updated`, user: { id, name, email } });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            res.status(200).json({ message: `User ${id} deleted` });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
}