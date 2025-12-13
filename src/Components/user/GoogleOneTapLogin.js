import React, { useContext, useState } from "react";
import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useValue, Context } from "../../context/ContextProvider";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const GoogleOAuthLogin = () => {
  const navigate = useNavigate();
  const { dispatch } = useValue();
  const { setCurrentUser } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("uid", "==", user.uid));
      const snapshot = await getDocs(userQuery);

      const userData = {
        uid: user.uid,
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        google: true,
      };

      if (snapshot.empty) {
        await addDoc(usersRef, userData);
      }

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

      navigate("/");
    } catch (error) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: error.message,
        },
      });
      console.error("Google OAuth Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<Google />}
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
