import { RegisterUser } from '../user/user.model';
// import { BlogModel } from '../blog/blog.model';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const blockUserIntoDB = async function (id: string, credentials: JwtPayload) {
  const role = credentials.role;
  if (role !== 'admin') {
    throw new Error('You are not authorized to perform this action');
  }

  const user = await RegisterUser.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  if (user.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is already blocked');
  }

  const result = await RegisterUser.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true },
  );
  return result;
};

// const deleteBlogFromDB = async function (id: string, credentials: JwtPayload) {
//   const role = credentials.role;
//   if (role !== 'admin') {
//     throw new Error('You have not permission to delete this blog');
//   }
//   const result = await BlogModel.findByIdAndDelete(id);
//   return result;
// };

export const AdminServices = {
  blockUserIntoDB,
  // deleteBlogFromDB,
};
