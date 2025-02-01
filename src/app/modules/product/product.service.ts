import QueryBuilder from '../../builder/QueryBuilder';
import { searchableFields } from './poduct.constant';
import { TProduct } from './product.interface';
import { ProductModel } from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  const result = await ProductModel.create(productData);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  // const query = searchTerm
  //   ? {
  //       $or: [
  //         { name: searchTerm },
  //         { brand: searchTerm },
  //         { category: searchTerm },
  //       ],
  //     }
  //   : {};
  // const result = await ProductModel.find(query);
  // return result;
  const productQuery = new QueryBuilder(ProductModel.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productQuery.countTotal();
  const result = await productQuery.modelQuery;
  return { meta, result };
};

const getSingleProductFromDB = async (productId: string) => {
  const result = await ProductModel.findById(productId);
  return result;
};

const updateProductFromDB = async (
  productId: string,
  data: Partial<TProduct>,
) => {
  const result = await ProductModel.findByIdAndUpdate(productId, data, {
    new: true,
  });
  return result;
};

const deleteProductFromDB = async (productId: string) => {
  const result = await ProductModel.findByIdAndDelete(productId, { new: true });
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductFromDB,
  deleteProductFromDB,
};
