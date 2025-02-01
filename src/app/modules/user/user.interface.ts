import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUserRole = keyof typeof USER_ROLE;

export interface TRegisterUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  phone?: string;
  address?: string;
  city?: string;
  isBlocked: boolean;
}

export type TLoginUser = {
  email: string;
  password: string;
};

export interface RegisterUserModel extends Model<TRegisterUser> {
  isUserExistsByEmail(email: string): Promise<TRegisterUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
