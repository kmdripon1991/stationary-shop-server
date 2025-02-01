import { Types } from 'mongoose';

export type TOrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type TOrderItem = {
  productId: Types.ObjectId;
  quantity: number;
};

export type TOrder = {
  user: Types.ObjectId;
  products: TOrderItem[];
  quantity: number;
  totalPrice: number;
  status: TOrderStatus[];
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
};
