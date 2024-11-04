import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
    min: [6, "Must be atleast 6 characters"]
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const User = model('User', userSchema)
export default User