import { model, Schema } from 'mongoose';
import { RegisterUserModel, TRegisterUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const RegisterUserSchema = new Schema<TRegisterUser, RegisterUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    phone: { type: String, default: 'N/A' },
    address: { type: String, default: 'N/A' },
    city: { type: String, default: 'N/A' },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

RegisterUserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

RegisterUserSchema.statics.isUserExistsByEmail = async function (
  email: string,
) {
  return await RegisterUser.findOne({ email }).select('+password');
};

RegisterUserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const RegisterUser = model<TRegisterUser, RegisterUserModel>(
  'RegisterUser',
  RegisterUserSchema,
);
