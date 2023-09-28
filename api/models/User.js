import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const userModel = mongoose.model("User", UserSchema);
export default userModel;
