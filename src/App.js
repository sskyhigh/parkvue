import "./App.css";
import React from "react";
// import SearchMenu from './Components/SearchMenu/SearchMenu';
import NavBar from "./Components/NavBar/NavBar";
import HomeBanner from "./Components/HomeBanner/HomeBanner";
// import MapSelect from './Components/HomeAd/MapSelect';
import Reserve from "./Components/HomeAd/Reserve";
import UploadListing from "./Components/HomeAd/UploadListing";
import { Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import { Toaster } from "react-hot-toast";

import FAQ from "./Components/FAQ/FAQ";
import AboutPage from "./Pages/AboutPage";
import Register from "./Components/user/Register";
import Login from "./Components/user/Login";
import Logout from "./Components/user/Logout";
import Notification from "./Components/Notification";
import Loading from "./Components/Loading";
import BottomNav from "./Components/user/BottomNav";
import ClusterMap from "./Components/map/ClusterMap";
import Booking from "./Components/rooms/Booking";
import NotFound from "./NotFound/NotFound";

const App = () => {
  return (
    <div className="App">
      <>
        <Loading />
        <Notification />
        <Login />
        <NavBar />
      </>
      <NavBar />
      {/*defines the position and duration*/}
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="app-container">
                <div className="home-banner-container">
                  <HomeBanner />
                </div>
              </div>
              <Reserve />
              <UploadListing />
              {/*<MapSelect/>*/}
              <FAQ />
            </>
          }
        />
        {/*Defining the routes*/}
        {/*website.com/register => registers accounts*/}
        {/*website.com/login => sends to login*/}
        {/*website.com/home => sends to homepage*/}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/map" element={<ClusterMap />} />
        <Route path="/space/*" element={<BottomNav />} />
        <Route path="/booking/:roomId" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"
      />
      {/* Link To JS */}
    </div>
  );
};

export default App;
