import mongoose, { mongo } from "mongoose";

const BookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  name: { type: String, required: true },
  maxGuests: { type: String, required: true },
  price: Number,
});
const BookingModel = mongoose.model("booking", BookingSchema);
export default BookingModel;
