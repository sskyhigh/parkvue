import "./App.css";
import React from "react";
import NavBar from "./Components/NavBar/NavBar";
import HomeBanner from "./Components/HomeBanner/HomeBanner";
import Reserve from "./Components/HomeAd/Reserve";
import UploadListing from "./Components/HomeAd/UploadListing";
import { Route, Routes } from "react-router-dom";
import { useTheme, Box } from "@mui/material";

import { Toaster } from "react-hot-toast";

import FAQ from "./Components/FAQ/FAQ";
import AboutPage from "./Pages/AboutPage";
import Register from "./Components/user/Register";
import Login from "./Components/user/Login";
import Logout from "./Components/user/Logout";
import Notification from "./Components/Notification";
import Loading from "./Components/Loading";
import AddRoom from "./Components/addRoom/AddRoom";
import ClusterMap from "./Components/map/ClusterMap";
import Booking from "./Components/rooms/Booking";
import Rooms from "./Components/rooms/Rooms";
import NotFound from "./NotFound/NotFound";
import UserDashboard from "./Components/user/Dashboard";
import UserProfile from "./Components/user/UserProfile";
import { FloatingButtonsHolder } from "./Components/chatbot/FloatingChatHolder";

const App = () => {
  const muiTheme = useTheme();

  return (
    <div className="App" style={{ background: muiTheme.palette.background.default, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Box sx={{ flexShrink: 0, zIndex: 1200, position: "relative" }}>
        <Loading />
        <Notification />
        <NavBar />
      </Box>
      <FloatingButtonsHolder />

      {/*defines the position and duration*/}
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", position: "relative", display: "flex", flexDirection: "column" }} id="scrollable-content">
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
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/map" element={<ClusterMap />} />
          <Route path="/upload" element={<AddRoom />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking/:roomId" element={<Booking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"
      />
      {/* Link To JS */}
    </div>
  );
};

export default App;
