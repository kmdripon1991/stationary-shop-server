import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { TLoginUser, TRegisterUser } from './user.interface';
import { RegisterUser } from './user.model';
import config from '../../config';
import { createToken, verifyToken } from './user.utils';

const createRegisterUserIntoDB = async (payload: TRegisterUser) => {
  const result = await RegisterUser.create(payload);
  return {
    _id: result._id,
    name: result.name,
    email: result.email,
  };
};

const loginUser = async (payload: TLoginUser) => {
  //checking if the user is exists
  const user = await RegisterUser.isUserExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // checking if the password is correct
  const isPasswordIsMatched = await RegisterUser.isPasswordMatched(
    payload?.password,
    user.password,
  );
  if (!isPasswordIsMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  //Access Granted. Send Access Token and Refresh Token
  //create token and sent to the client
  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  // console.log('token', token);
  //check the given token is verified
  // const decoded = jwt.verify(
  //   token,
  //   config.jwt_refresh_secret as string,
  // ) as JwtPayload;
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { userEmail } = decoded;
  //check if user is exist
  // const user = await User.isUserExistByCustomId(userId);
  const user = await RegisterUser.isUserExistsByEmail(userEmail);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, '🔍❓ User not Found');
  }
  //check if user is deleted
  // const isDeleted = user?.isDeleted;
  // if (isDeleted) {
  //   throw new AppError(StatusCodes.FORBIDDEN, '🗑️ User is Deleted');
  // }
  // //check if user is blocked
  const userStatus = user?.isBlocked;
  if (userStatus === true) {
    throw new AppError(StatusCodes.FORBIDDEN, '🚫 User is Blocked');
  }
  // //check password matched
  // if (
  //   user.passwordChangedAt &&
  //   User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)
  // ) {
  //   throw new AppError(
  //     httpStatus.UNAUTHORIZED,
  //     'Invalid password. Please try again.',
  //   );
  // }
  //create token and sent to the client
  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return {
    accessToken,
  };
};

export const RegisterUserServices = {
  createRegisterUserIntoDB,
  loginUser,
  refreshToken,
};
