import { Request, Response } from 'express';
import { OrderServices } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatusCodes from 'http-status-codes';

const createOrder = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const orderData = req.body;
    console.log(orderData);
    const { userEmail } = req.user;
    const result = await OrderServices.createOrderIntoDB(
      userEmail,
      orderData,
      req.ip!,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatusCodes.CREATED,
      message: 'Order placed successfully',
      data: result,
    });
  },
);

const allOrders = catchAsync(async (req: Request, res: Response) => {
  const { userEmail } = req.user;
  const result = await OrderServices.getAllOrdersFromDB(userEmail);
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCodes.OK,
    message: 'All orders retrieved successfully',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const result = await OrderServices.verifyPayment(
    req.query.order_id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCodes.CREATED,
    message: 'Order verified successfully',
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const orderId = req.params.OrderId;
  const result = await OrderServices.updateOrderIntoDB(orderId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCodes.OK,
    message: 'Order Updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteOrderFromDB(req.params.orderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatusCodes.OK,
    message: 'Order Deleted successfully',
    data: result,
  });
});
export const OrderControllers = {
  createOrder,
  allOrders,
  verifyPayment,
  updateOrder,
  deleteOrder,
};
