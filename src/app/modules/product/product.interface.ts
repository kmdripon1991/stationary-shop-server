export type TProductCategory =
  | 'Writing'
  | 'Office Supplies'
  | 'Art Supplies'
  | 'Educational'
  | 'Technology';

export type TProduct = {
  name: string;
  brand: string;
  price: number;
  model: string;
  category: TProductCategory;
  description: string;
  quantity: number;
  image: string;
  inStock: boolean;
};
