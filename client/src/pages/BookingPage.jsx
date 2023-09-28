import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PhotoGallery from "../PhotoGallery";
import Dates from "../Dates";

export default function BookingPage() {
  const [booking, setBooking] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then(({ data }) => {
        setBooking(data.find(({ _id }) => _id === id));
      });
    }
  }, [id]);
  if (!booking) {
    return <p>Loading...</p>;
  }
  return (
    <div className="my-8">
      <h1 className="text-2xl ">{booking.place.title}</h1>
      <a
        className="flex gap-1 my-2 font-semibold underline"
        target="_blank"
        href={"https://maps.google.com/?q=" + booking.place.address}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>

        {booking.place.address}
      </a>
      <div className="flex items-center justify-between bg-gray-200 p-6 my-6 rounded-2xl">
        <div>
          <h2 className="text-2xl mb-4">Your Booking Information</h2>
          <Dates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total Price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PhotoGallery place={booking.place} />
    </div>
  );
}
