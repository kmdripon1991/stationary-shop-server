import { z } from 'zod';

const ProductCategoryEnum = [
  'Writing',
  'Office Supplies',
  'Art Supplies',
  'Educational',
  'Technology',
] as const;

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Product name is required.' }).trim(),
    brand: z.string().min(1, { message: 'Brand name is required.' }).trim(),
    price: z
      .number({
        required_error: 'Price is required.',
      })
      .min(0, { message: 'Price must be a positive number.' }),
    model: z.string().min(1, { message: 'Model is required.' }),
    category: z.enum(ProductCategoryEnum, {
      errorMap: () => ({
        message:
          'Category must be one of Writing, Office Supplies, Art Supplies, Educational, or Technology.',
      }),
    }),
    description: z.string().min(1, { message: 'Description is required.' }),
    quantity: z
      .number({
        required_error: 'Quantity is required.',
      })
      .min(0, { message: 'Quantity cannot be negative.' }),
    inStock: z.boolean({
      required_error: 'InStock field is required.',
    }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    price: z.number().optional(),
    model: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    quantity: z.string().optional(),
    inStock: z.string().optional(),
  }),
});

// Exported for validation in update cases
export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
