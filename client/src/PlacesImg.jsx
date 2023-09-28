import React from "react";

export default function PlacesImg({ place, index = 0 }) {
  if (!place?.photos?.length) return;
  return (
    <img
      src={"http://localhost:4000/uploads/" + place.photos[index]}
      className="w-full h-full object-cover"
      alt=""
    />
  );
}
