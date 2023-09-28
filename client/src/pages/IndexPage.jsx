import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [placesData, setPlacesData] = useState([]);
  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlacesData(data);
    });
  }, []);
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8">
      {placesData.length > 0 &&
        placesData.map((place) => (
          <Link key={place._id} to={"/place/" + place._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              <img
                src={"http://localhost:4000/uploads/" + place.photos[0]}
                className="rounded-2xl aspect-square object-cover"
                alt=""
              />
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> Per Night
            </div>
          </Link>
        ))}
    </div>
  );
}
