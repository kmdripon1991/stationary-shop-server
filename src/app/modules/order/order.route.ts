import express from 'express';
import { OrderControllers } from './order.controller';
import Auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();
router.post(
  '/create-order',
  Auth(USER_ROLE.user),
  OrderControllers.createOrder,
);
router.get(
  '/all-orders',
  Auth(USER_ROLE.admin, USER_ROLE.user),
  OrderControllers.allOrders,
);

router.get(
  '/verify',
  Auth(USER_ROLE.admin, USER_ROLE.user),
  OrderControllers.verifyPayment,
);

router.put(
  '/update-order/:orderId',
  Auth(USER_ROLE.admin, USER_ROLE.user),
  OrderControllers.updateOrder,
);

router.delete(
  '/delete-order/:orderId',
  Auth(USER_ROLE.admin, USER_ROLE.user),
  OrderControllers.deleteOrder,
);

export const OrderRoutes = router;
