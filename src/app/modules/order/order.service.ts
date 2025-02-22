import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { ProductModel } from '../product/product.model';
import { RegisterUser } from '../user/user.model';
import { TOrder, TOrderItem } from './order.interface';
import { OrderModel } from './order.model';
import httpStatusCodes from 'http-status-codes';
import { OrderUtils } from './order.utils';

const createOrderIntoDB = async (
  userEmail: string,
  payload: TOrderItem[],
  client_ip: string,
) => {
  // Find the user placing the order
  const user = await RegisterUser.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
  }

  if (!payload || payload.length === 0) {
    throw new AppError(
      httpStatusCodes.FORBIDDEN,
      'Order must contain at least one product.',
    );
  }

  // Start a new session
  const session = await mongoose.startSession();

  // Start a transaction
  session.startTransaction();
  try {
    const products: TOrderItem[] = [];
    let totalPrice = 0;

    for (const item of payload) {
      const product = await ProductModel.findById(item.productId).session(
        session,
      );

      // Check if the product exists
      if (!product) {
        throw new AppError(
          httpStatusCodes.NOT_FOUND,
          `Product with ID ${item.productId} not found.`,
        );
      }

      // Check stock availability
      if (product.quantity < item.quantity) {
        throw new AppError(
          httpStatusCodes.BAD_REQUEST,
          `Insufficient stock for product: ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}.`,
        );
      }

      // Deduct the product quantity from stock
      product.quantity -= item.quantity;

      // Mark product as out of stock if quantity reaches 0
      if (product.quantity === 0) {
        product.inStock = false;
      }

      // Save updated product details within the transaction
      await product.save({ session });

      // Calculate total price for this order
      totalPrice = parseFloat(
        (totalPrice + product.price * item.quantity).toFixed(2),
      );

      // Prepare the product data for the order
      products.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    // Place the order in the database
    let placeOrder = await OrderModel.create(
      [
        {
          user: user?._id,
          products,
          totalPrice,
        },
      ],
      { session },
    );

    // payment integration
    const shurjopayPayload = {
      amount: totalPrice,
      order_id: placeOrder[0]._id,
      currency: 'BDT',
      customer_name: user.name,
      customer_address: user.address,
      customer_email: user.email,
      customer_phone: user.phone,
      customer_city: user.city,
      client_ip,
    };

    const payment = await OrderUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus) {
      placeOrder = await placeOrder[0].updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { order: placeOrder[0], payment };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // Rollback the transaction in case of any error
    await session.abortTransaction();
    // session.endSession();
    throw new Error(err);
  } finally {
    session.endSession();
  }
};

const getAllOrdersFromDB = async (userEmail: string) => {
  const user = await RegisterUser.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
  }

  let orders;
  if (user.role === 'admin') {
    orders = await OrderModel.find().populate('user');
    // orders = await OrderModel.find();
  } else {
    orders = await OrderModel.find({ user: user._id }).populate('user');
    // orders = await OrderModel.find({ user: user._id });
  }

  return orders;
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await OrderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await OrderModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  return verifiedPayment;
};

const updateOrderIntoDB = async (orderId: string, payload: TOrder) => {
  //payload will be changed to order status
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new AppError(httpStatusCodes.NOT_FOUND, 'Order not found');
  }
  if (order.transaction.bank_status === 'Success') {
    order.status = payload.status;
  }

  await order.save();
  return order;
};

const deleteOrderFromDB = async (orderId: string) => {
  const order = await OrderModel.findByIdAndDelete(orderId);
  return order;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  verifyPayment,
  updateOrderIntoDB,
  deleteOrderFromDB,
};
