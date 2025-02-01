import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

const ProductCategoryEnum = [
  'Writing',
  'Office Supplies',
  'Art Supplies',
  'Educational',
  'Technology',
];

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required.'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price must be a positive number.'],
    },
    model: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: {
        values: ProductCategoryEnum,
        message:
          'Category must be one of Writing, Office Supplies, Art Supplies, Educational, or Technology.',
      },
      required: [true, 'Category is required.'],
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [0, 'Quantity cannot be negative.'],
    },
    inStock: {
      type: Boolean,
      required: [true, 'InStock field is required.'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ProductModel = model<TProduct>('Product', productSchema);
