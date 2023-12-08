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
// import Login from './Pages/Login';
import Register from "./Pages/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";

import FAQ from "./Components/FAQ/FAQ";
import AboutPage from "./Pages/AboutPage";
import Login from "./Components/user/Login";
import Notification from "./Components/Notification";
import Loading from "./Components/Loading";
import BottomNav from "./Components/user/BottomNav";
import ClusterMap from "./Components/map/ClusterMap";

// connects client to backend
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/map" element={<ClusterMap />} />
        <Route path="/upload" element={<BottomNav />} />
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
