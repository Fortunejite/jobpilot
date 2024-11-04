import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: Array<string>,
  },
  stock: {
    type: Number,
    required: true,
  },
  sizes: {
    type: Array<string>,
  },
  colors: {
    type: Array<string>,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
})

const Product = model('Product', productSchema)
export default Product