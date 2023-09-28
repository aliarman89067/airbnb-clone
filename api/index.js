import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./models/User.js";
import PlaceModel from "./models/Place.js";
import BookingModel from "./models/Booking.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import image from "image-downloader";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jwtSecret = "adjaoiruw34895useopfksaflj84r5";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5174",
  })
);

mongoose.connect(process.env.MONGO_URL);
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await userModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    res.json(user);
  } catch (err) {
    res.status(422).json(err);
    console.log(err);
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await userModel.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not Ok");
    }
  } else {
    res.json("Not Found!");
  }
});
const getUserFromToken = (token) => {
  return new Promise((resolve, rejects) => {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
};
app.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    const user = await getUserFromToken(token);
    const { name, email, _id } = await userModel.findById(user.id);
    res.json({ name, email, _id });
  }
});
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const photoName = Date.now() + ".jpg";
  await image.image({ url: link, dest: __dirname + "/uploads/" + photoName });
  res.json(photoName);
});
const multerMiddleWare = multer({ dest: "uploads/" });
app.post("/upload", multerMiddleWare.array("photos", 100), async (req, res) => {
  const photoArray = [];
  for (let i = 0; i < req.files.length; i++) {
    const { originalname, path, filename } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    photoArray.push(newPath.replace("uploads", ""));
  }
  res.json(photoArray);
});
app.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const user = await getUserFromToken(token);
  const {
    title,
    address,
    addedPhotos: photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  const placeDoc = await PlaceModel.create({
    owner: user.id,
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  });
  res.json(placeDoc);
});
app.get("/user-places", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    const user = await getUserFromToken(token);
    const { id } = user;
    const placeDoc = await PlaceModel.find({ owner: id });
    res.json(placeDoc);
  }
});
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await PlaceModel.findById(id));
});
app.put("/places/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos: photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  if (token) {
    const user = await getUserFromToken(token);
    const placeDoc = await PlaceModel.findById(id);
    if (user.id === placeDoc.owner.toString()) {
      await placeDoc.set({
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  }
});
app.post("/delete-place/:id", async (req, res) => {
  const { id } = req.params;
  await PlaceModel.findByIdAndDelete(id);
  res.json("Deleted");
});
app.get("/places", async (req, res) => {
  res.json(await PlaceModel.find());
});
app.post("/bookings", async (req, res) => {
  const { token } = req.cookies;
  const userData = await getUserFromToken(token);
  const {
    place,
    checkIn,
    checkOut,
    numberOfGuests: maxGuests,
    name,
    mobile: phone,
    price,
  } = req.body;
  const bookingDoc = await BookingModel.create({
    user: userData.id,
    place,
    checkIn,
    checkOut,
    maxGuests,
    name,
    phone,
    price,
  });
  res.json(bookingDoc);
});
app.get("/bookings", async (req, res) => {
  const { token } = req.cookies;
  const user = await getUserFromToken(token);
  const bookingDocs = await BookingModel.find({ user: user.id }).populate(
    "place"
  );
  res.json(bookingDocs);
});
app.listen(4000);
