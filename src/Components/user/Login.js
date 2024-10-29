// Login.js
import { useContext, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { PulseLoader } from "react-spinners";
import { Close, Send } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordField from "./PasswordField";
import GoogleOneTapLogin from "./GoogleOneTapLogin";
import "../NavBar/NavBar.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  db,
  auth,
  collection,
  query,
  where,
  getDocs,
  sendPasswordResetEmail,
} from "../../firebase/config";
import { useValue, Context } from "../../context/ContextProvider";

const Login = () => {
  const { dispatch } = useValue();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(Context);

  const handleClose = () => {
    navigate("/"); // Close the dialog and navigate to the homepage
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: "Please provide an email",
        },
      });
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        // Store userData in localSession
        sessionStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userData", JSON.stringify(userData));
        setCurrentUser(userData);
        navigate("/");
      }
    } catch (error) {
      let errorMessage = "An error Occurred: " + error.message;
      let errorType = "error";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid credentials";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Provide an email";
        errorType = "info";
      } else if (error.code === "auth/missing-password") {
        errorMessage = "Enter a password";
        errorType = "info";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Account has been blocked by an Admin";
        errorType = "error";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Try later";
        errorType = "error";
      }
      dispatch({
        type: "UPDATE_ALERT",
        payload: { open: true, severity: errorType, message: errorMessage },
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = emailRef.current.value;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: "Please provide an email",
        },
      });
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Reset email sent",
        },
      });
    } catch (error) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Couldn't send reset email",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={location.pathname === "/login"} onClose={handleClose}>
      <DialogTitle>
        Login
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => navigate("/")}
        >
          <Close onClick={handleClose} />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent dividers>
          <DialogContentText>
            Please enter your login information:
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            variant="standard"
            id="email"
            label="Email"
            type="email"
            fullWidth
            inputRef={emailRef}
            required
          />
          <PasswordField passwordRef={passwordRef} />
        </DialogContent>
        <DialogActions sx={{ px: "19px" }}>
          {loading ? (
            <PulseLoader color="#005fff" size={32} />
          ) : (
            <Button type="submit" variant="contained" endIcon={<Send />}>
              Login
            </Button>
          )}
        </DialogActions>
        <DialogActions sx={{ justifyContent: "left", p: "5px 24px" }}>
          Forgot Password?
          <Button onClick={handlePasswordReset}>Reset password</Button>
        </DialogActions>
      </form>
      <DialogActions sx={{ justifyContent: "left", p: "5px 24px" }}>
        Don’t have an account?
        <Button onClick={() => navigate("/register")}>Register</Button>
      </DialogActions>
      <DialogActions sx={{ justifyContent: "center", py: "24px" }}>
        <GoogleOneTapLogin />
      </DialogActions>
    </Dialog>
  );
};

export default Login;
