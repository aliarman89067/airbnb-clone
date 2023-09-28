import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import PhotoGallery from "../PhotoGallery";

export default function SinglePlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState();
  useEffect(() => {
    if (id) {
      axios.get(`/places/${id}`).then(({ data }) => {
        setPlace(data);
      });
    }
  }, [id]);
  if (!place) {
    return <p>Loading</p>;
  }
  return (
    <div className="mt-8 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <a
        className="flex gap-1 my-2 font-semibold underline"
        target="_blank"
        href={"https://maps.google.com/?q=" + place.address}
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

        {place.address}
      </a>
      <PhotoGallery place={place} />
      <div className="grid grid-cols-1 mt-8 gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place.description}
          </div>
          Check-In: {place.checkIn} <br />
          Check-Out: {place.checkOut} <br />
          Max Number Of Guests: {place.maxGuests}
          <div className="mt-2">
            <h2 className="text-xl font-semibold mb-1">Extra Info</h2>
            <p className="text-sm text-gray-700 leading-5">{place.extraInfo}</p>
          </div>
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
    </div>
  );
}
