import express, { Request, Response } from 'express';
import { User } from '../models/User__model'; // Import your User model

// Create a new router
const router = express.Router();

// Create operation
router.post('/users', async (req: Request, res: Response) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Read operation - Get all users
router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Read operation - Get user by ID
router.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update operation
router.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updatedRowsCount, updatedUsers] = await User.update(req.body, { where: { user__id: id }, returning: true });
        if (updatedRowsCount > 0 && updatedUsers.length > 0) {
            res.status(200).json(updatedUsers[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete operation
router.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedRowsCount = await User.destroy({ where: { user__id: id } });
        if (deletedRowsCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router
export default router;
