// Register.js
import { useRef, useState, useContext } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import PasswordField from "./PasswordField";
import "../NavBar/NavBar.css"; // Assuming some CSS here
import { useValue, Context } from "../../context/ContextProvider";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  collection,
  addDoc,
} from "../../firebase/config";

const Register = () => {
  const { dispatch } = useValue();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(Context);

  const handleClose = () => {
    navigate("/"); // Close the dialog and navigate to the homepage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullName = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "info",
          message: "Passwords do not match",
        },
      });
      return;
    }

    if (!fullName.trim()) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "info",
          message: "Enter your full name",
        },
      });
      return;
    } else if (fullName.length < 3) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "info",
          message: "Name must be at least 3 characters",
        },
      });
      return;
    }
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
    
      const userData = {
        uid: user.uid,
        fullName: fullName,
        email: email,
      };
    
      await addDoc(collection(db, "users"), userData);
    
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Registration successful",
        },
      });
    
      sessionStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("userData", JSON.stringify(userData));
      setCurrentUser(userData);
      navigate("/");
    } catch (error) {
      let errorMessage = "An error occurred:" + error.message;
      let errorType = "error";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use";
        errorType = "error";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password must be at least 6 characters";
        errorType = "error";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please provide a valid email";
        errorType = "info";
      } else if (error.code === "auth/missing-password") {
        errorMessage = "Please provide a password";
        errorType = "info";
      }
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: errorType,
          message: errorMessage,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={location.pathname === "/register"} onClose={handleClose}>
      <DialogTitle>
        Register
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => navigate("/")}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent dividers>
          <DialogContentText>
            Please fill in your registration details:
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            variant="standard"
            id="name"
            label="Name"
            type="text"
            fullWidth
            inputRef={nameRef}
            inputProps={{ minLength: 2 }}
            required
          />
          <TextField
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
          <PasswordField
            passwordRef={confirmPasswordRef}
            id="confirmPassword"
            label="Confirm Password"
          />
        </DialogContent>
        <DialogActions sx={{ px: "19px" }}>
          {loading ? (
            <PulseLoader color="#005fff" size={32} />
          ) : (
            <Button type="submit" variant="contained" endIcon={<Send />}>
              Register
            </Button>
          )}
        </DialogActions>
      </form>
      <DialogActions sx={{ justifyContent: "left", p: "5px 24px" }}>
        Already have an account?
        <Button onClick={() => navigate("/login")}>Login</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Register;
