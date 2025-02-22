import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { StatusCodes } from 'http-status-codes';
import { RegisterUserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await RegisterUserServices.createRegisterUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    message: 'User registered successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await RegisterUserServices.loginUser(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    success: true,
    message: 'Login successful',
    statusCode: StatusCodes.OK,
    data: { token: accessToken },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await RegisterUserServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

export const RegisterUserControllers = {
  registerUser,
  loginUser,
  refreshToken,
};
