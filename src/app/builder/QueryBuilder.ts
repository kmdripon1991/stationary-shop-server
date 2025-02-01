import { SortOrder, Types } from 'mongoose';
import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this?.query?.search;
    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['search', 'sortBy', 'sortOrder', 'orderId'];
    excludeFields.forEach((el) => delete queryObj[el]);
    const filter: Record<string, unknown> = {};
    if (queryObj.filter) {
      filter.author = new Types.ObjectId(queryObj.filter as string);
    }
    this.modelQuery = this.modelQuery.find(filter as FilterQuery<T>);
    return this;
  }

  sort() {
    let sortBy = 'price';
    if (this.query.sortBy) {
      sortBy = this.query.sortBy as string;
    }
    let sortOrder: SortOrder = 1;
    if (this.query.sortOrder === 'desc') {
      sortOrder = -1;
    }

    this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder });
    return this;
  }
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit || 0;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);
    // console.log(totalQuery);
    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
