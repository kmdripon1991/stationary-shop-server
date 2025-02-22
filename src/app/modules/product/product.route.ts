import express from 'express';
import { ProductControllers } from './product.controller';
import Auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', ProductControllers.getAllProducts);

router.get('/:productId', ProductControllers.singleProduct);

router.post(
  '/create-product',
  Auth(USER_ROLE.admin),
  // (req: Request, res: Response, next: NextFunction) => {
  //   console.log(req.body);
  //   req.body = JSON.parse(req.body.data);
  //   next();
  // },
  ProductControllers.createProduct,
);
router.put(
  '/:productId',
  Auth(USER_ROLE.admin),
  ProductControllers.updateProduct,
);
router.delete(
  '/:productId',
  Auth(USER_ROLE.admin),
  ProductControllers.deleteProduct,
);

export const ProductRoutes = router;
