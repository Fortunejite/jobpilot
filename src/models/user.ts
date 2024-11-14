import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: [6, "Must be atleast 6 characters"]
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
  },
  isWorker: {
    type: Boolean,
    default: true,
  },
  provider: {
    type: String
  },
  avatar: {
    type: String,
    default: '/icons/profile.png'
  },
}, {timestamps: true})

const User = models.User || model('User', userSchema)
export default User