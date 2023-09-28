import React, { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNavigation from "../AccountNavigation";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, setUser, user } = useContext(UserContext);
  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }
  if (!ready && user) {
    window.location.reload();
  }
  if (!ready && !user) {
    return <p>Loading...</p>;
  }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <AccountNavigation />
      <div className="text-center max-w-lg mx-auto">
        Logged in as {user.name} ({user.email}) <br />
        <button className="primary max-w-md mt-2" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
