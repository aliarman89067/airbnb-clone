import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./userContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }
  async function bookThisPlace() {
    const data = {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      mobile,
      place: place._id,
      price: numberOfDays * place.price,
    };
    const { data: placeData } = await axios.post("/bookings", data);
    setRedirect("/account/booking/" + placeData._id);
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        $Price: {place.price} / per Night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex justify-center">
          <div className="py-3 px-4">
            <label>Check In: </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check Out: </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of Guests: </label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
          />
        </div>
        {numberOfDays > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your Full Name: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Phone Number: </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        )}
      </div>
      <button className="primary mt-4" onClick={bookThisPlace}>
        Book This Place{" "}
        {numberOfDays > 0 && <span>${numberOfDays * place.price}</span>}
      </button>
    </div>
  );
}
