import React, { useContext, useEffect, useRef, useState } from "react";
import { Google } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { useValue, Context } from "../../context/ContextProvider";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleOAuthLogin = ({ onLoadingChange } = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useValue();
  const { setCurrentUser } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const forceStopTimerRef = useRef(null);
  const didSucceedRef = useRef(false);

  const resolveRedirectTo = (value) => {
    if (typeof value !== "string") return "/dashboard";
    if (!value.startsWith("/")) return "/dashboard";
    if (value === "/login" || value === "/register") return "/dashboard";
    return value;
  };

  const redirectTo = resolveRedirectTo(location?.state?.redirectTo);

  useEffect(() => {
    if (typeof onLoadingChange === "function") onLoadingChange(loading);
  }, [loading, onLoadingChange]);

  // If the popup is closed/cancelled, sometimes the promise can take a while to reject.
  // Use a focus + timeout watchdog so the UI never stays disabled.
  useEffect(() => {
    if (!loading) {
      if (forceStopTimerRef.current) {
        clearTimeout(forceStopTimerRef.current);
        forceStopTimerRef.current = null;
      }
      return;
    }

    const handleFocus = () => {
      // When the popup closes, focus returns here.
      // If the user actually completed sign-in, Firebase is still processing and we should
      // keep the page locked until we navigate.
      setTimeout(() => {
        if (didSucceedRef.current) return;
        if (auth.currentUser) return;
        setLoading(false);
      }, 1200);
    };

    window.addEventListener("focus", handleFocus);

    forceStopTimerRef.current = setTimeout(() => {
      if (didSucceedRef.current) return;
      setLoading(false);
    }, 20000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      if (forceStopTimerRef.current) {
        clearTimeout(forceStopTimerRef.current);
        forceStopTimerRef.current = null;
      }
    };
  }, [loading]);

  const handleGoogleLogin = async () => {
    didSucceedRef.current = false;
    const provider = new GoogleAuthProvider();
    setLoading(true);
    if (typeof onLoadingChange === "function") onLoadingChange(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Popup sign-in completed successfully. Keep the UI locked while we finish profile setup.
      didSucceedRef.current = true;
      const userData = {
        uid: user.uid,
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        google: true,
      };

      // Ensure a user profile exists quickly and deterministically (doc id = uid).
      // This prevents races where the app sees an Auth user but can't find a Firestore profile yet.
      await setDoc(doc(db, "users", user.uid), userData, { merge: true });

      sessionStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("userData", JSON.stringify(userData));
      setCurrentUser(userData);

      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Google login successful",
        },
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      const code = error?.code;
      // User cancelled/closed the popup: don't show an error, just reset UI.
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        return;
      }

      // Any real error: allow UI to unlock.
      didSucceedRef.current = false;

      const message =
        code === "auth/user-disabled"
          ? "Your account has been disabled. Please contact support."
          : error?.message || "Google sign-in failed";

      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message,
        },
      });
      console.error("Google OAuth Error:", error);
    } finally {
      if (!didSucceedRef.current) {
        setLoading(false);
        if (typeof onLoadingChange === "function") onLoadingChange(false);
      }
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={loading ? <CircularProgress size={18} /> : <Google />}
      disabled={loading}
      onClick={handleGoogleLogin}
      sx={{
        textTransform: "none",
        fontWeight: 600,
        py: 1.2,
        borderRadius: 2,
        borderColor: "grey.300",
        "&:hover": { borderColor: "primary.main", background: "primary.light" },
      }}
    >
      {loading ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleOAuthLogin;
