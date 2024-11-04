import mongoose from "mongoose";

const url = "mongodb://localhost:27017/Shop"

mongoose.connect(url).then(() => console.log("MongoDB connected.")).catch((error) => console.log(error));
