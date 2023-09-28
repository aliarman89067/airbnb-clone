import React, { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNavigation from "../AccountNavigation";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlacesFormPage() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then(({ data }) => {
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function HeadingAndPara(heading, para) {
    return (
      <>
        <h2 className="text-2xl mt-4">{heading}</h2>
        <p className="text-sm text-gray-500">{para}</p>
      </>
    );
  }
  async function savePlace(e) {
    e.preventDefault();
    const data = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      // update Place
      await axios.put("/places/" + id, data);
    } else {
      // add new place
      await axios.post("/places", data);
    }
    setRedirect(true);
  }
  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNavigation />
      <form onSubmit={savePlace}>
        {HeadingAndPara(
          "Title",
          "Title for you place, should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title, for example, My Lovely Apartment"
        />
        {HeadingAndPara("Address", "Address to this place")}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {HeadingAndPara("Photos", "More = Better")}
        <PhotosUploader
          setAddedPhotos={setAddedPhotos}
          addedPhotos={addedPhotos}
          setPhotoLink={setPhotoLink}
          photoLink={photoLink}
        />
        {HeadingAndPara("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {HeadingAndPara("Perks", "Select all the perks of your places")}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <Perks perks={perks} setPerks={setPerks} />
        </div>
        {HeadingAndPara("Extra Info", "House rules, etc")}
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        ></textarea>
        {HeadingAndPara(
          "Check in & Out Time, Max Guests",
          "Add check in and out time remember some time window cleaning between guests"
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <h3 className="mt-2 -mb-2">Check In Time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              placeholder="5:00 PM"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-2">Check Out Time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder="5:00 AM"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-2">Max Guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              placeholder="for example 10 guests"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-2">Price Per Night</h3>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="for example 10 guests"
            />
          </div>
        </div>
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}
