import axios from "axios";
import React from "react";

export default function PhotosUploader({
  setAddedPhotos,
  addedPhotos,
  setPhotoLink,
  photoLink,
}) {
  async function addedPhotoByLink(e) {
    e.preventDefault();
    if (photoLink) {
      const { data } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      setAddedPhotos((prev) => {
        return [...prev, data];
      });
    }
    setPhotoLink("");
  }
  async function handlePhotoFile(e) {
    const file = e.target.files;
    const data = new FormData();
    for (let i = 0; i < file.length; i++) {
      data.append("photos", file[i]);
    }
    const response = await axios.post("/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setAddedPhotos((prev) => {
      return [...prev, ...response.data];
    });
  }
  function handlePhotoDelete(photo) {
    setAddedPhotos([...addedPhotos.filter((allPhoto) => allPhoto != photo)]);
  }
  function handlePhotoMain(photo) {
    setAddedPhotos([
      photo,
      ...addedPhotos.filter((photos) => photos !== photo),
    ]);
  }
  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          placeholder="Add Image Using Link .jpg"
        />
        <button
          onClick={addedPhotoByLink}
          className="bg-gray-200 px-4 rounded-2xl whitespace-nowrap"
        >
          Add Photo
        </button>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 mt-3 gap-2">
        {addedPhotos?.map((photos, index) => (
          <div key={index} className="relative">
            <img
              className="rounded-2xl h-[160px] w-full object-cover"
              src={"http://localhost:4000/uploads/" + photos}
              alt=""
            />
            <div
              onClick={() => handlePhotoDelete(photos)}
              className="absolute bottom-2 right-2 bg-gray-800 rounded-full p-2 opacity-50 text-white hover:opacity-100 cursor-pointer transition-all"
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
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
            <div
              onClick={() => handlePhotoMain(photos)}
              className="absolute bottom-2 left-2 bg-gray-800 rounded-full p-2 opacity-50 text-white hover:opacity-100 cursor-pointer transition-all"
            >
              {photos === addedPhotos[0] ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
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
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
        <label className="flex items-center justify-center h-[160px] cursor-pointer gap-1 border border-gray-300 bg-transparent rounded-2xl text-2xl text-gray-500 p-2">
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handlePhotoFile}
          />
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
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}
