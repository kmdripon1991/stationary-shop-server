import express from 'express';
import { AdminControllers } from './admin.controller';
import Auth from '../../middlewares/auth';

const router = express.Router();

router.patch('/users/:userId/block', Auth('admin'), AdminControllers.blockUser);

router.delete('/blogs/:id', Auth('admin'), AdminControllers.deleteBlog);

export const AdminRoutes = router;
