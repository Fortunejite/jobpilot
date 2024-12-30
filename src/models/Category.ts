import { Model, model, models, Document, Schema } from "mongoose";

export interface ICategory {
  name: string;
}

export interface ICategoryDocument extends ICategory, Document {}

const categorySchema: Schema<ICategoryDocument> = new Schema({
  name: {
    type: String,
    required: true,
  }
})

const Category: Model<ICategoryDocument> =
  models.Category || model<ICategoryDocument>('Category', categorySchema);

export default Category;