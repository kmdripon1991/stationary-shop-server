import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AdminServices } from './admin.service';
import { StatusCodes } from 'http-status-codes';

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  await AdminServices.blockUserIntoDB(userId, req.user);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User block successful',
    statusCode: StatusCodes.OK,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await AdminServices.deleteBlogFromDB(id, req.user);
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Blog deleted successfully',
    statusCode: StatusCodes.OK,
  });
});

export const AdminControllers = {
  blockUser,
  deleteBlog,
};
