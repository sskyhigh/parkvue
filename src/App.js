import "./App.css";
import React, { useEffect, lazy, Suspense } from "react";
import NavBar from "./Components/NavBar/NavBar";
import HomeBanner from "./Components/HomeBanner/HomeBanner";
import Reserve from "./Components/HomeAd/Reserve";
import UploadListing from "./Components/HomeAd/UploadListing";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTheme, Box, CircularProgress } from "@mui/material";

import { Toaster } from "react-hot-toast";

import FAQ from "./Components/FAQ/FAQ";
import Notification from "./Components/Notification";
import Loading from "./Components/Loading";
import { FloatingButtonsHolder } from "./Components/chatbot/FloatingChatHolder";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "./Components/ScrollToTop";

// Lazy load route components for better performance
const AboutPage = lazy(() => import("./Pages/AboutPage"));
const TermsPage = lazy(() => import("./Pages/TermsPage"));
const PrivacyPage = lazy(() => import("./Pages/PrivacyPage"));
const SecurityPage = lazy(() => import("./Pages/SecurityPage"));
const ContactPage = lazy(() => import("./Pages/ContactPage"));
const Register = lazy(() => import("./Components/user/Register"));
const Login = lazy(() => import("./Components/user/Login"));
const Logout = lazy(() => import("./Components/user/Logout"));
const AddRoom = lazy(() => import("./Components/addRoom/AddRoom"));
const ClusterMap = lazy(() => import("./Components/map/ClusterMap"));
const Booking = lazy(() => import("./Components/rooms/Booking"));
const Rooms = lazy(() => import("./Components/rooms/Rooms"));
const NotFound = lazy(() => import("./NotFound/NotFound"));
const UserDashboard = lazy(() => import("./Components/user/Dashboard"));
const UserProfile = lazy(() => import("./Components/user/UserProfile"));
const SellerProfile = lazy(() => import("./Components/user/SellerProfile"));

const App = () => {
  const muiTheme = useTheme();
  const location = useLocation();
  const pathname = location.pathname;
  
  useEffect(() => {
    document.title = pathname === "/" ? "ParkVue" : `ParkVue - ${pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)}`;
  }, [pathname]);

  return (
    <div className="App" style={{ background: muiTheme.palette.background.default, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Box sx={{ flexShrink: 0, zIndex: 1200, position: "relative" }}>
        <Loading />
        <Notification />
        <NavBar />
      </Box>
      <ScrollToTop />
      <FloatingButtonsHolder />

      {/*defines the position and duration*/}
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", position: "relative", display: "flex", flexDirection: "column" }} id="scrollable-content">
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <CircularProgress />
            </Box>
          }>
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
              <Route path="/seller/:sellerId" element={<SellerProfile />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/map" element={<ClusterMap />} />
              <Route path="/upload" element={<AddRoom />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/booking/:roomId" element={<Booking />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
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
