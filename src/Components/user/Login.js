// Login.js
import { useContext, useRef, useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Box,
  Typography,
  useTheme,
  alpha,
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
  const { currentUser, setCurrentUser } = useContext(Context);
  
  // Get theme from context and Material-UI
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleClose = () => {
    navigate("/"); // Close the dialog and navigate to the homepage
  };

    useEffect(() => {
      if (currentUser) {
        navigate("/");
      };
    }, [currentUser, navigate]);
  
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
        navigate("/dashboard"); // Redirect to dashboard after login
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
    <Dialog 
      open={location.pathname === "/login"} 
      onClose={handleClose}
      BackdropProps={{
        sx: {
          // Customize the backdrop
          background: isDarkMode 
            ? alpha(theme.palette.background.paper, 0.95) // Dark overlay for dark mode
            : alpha(theme.palette.background.paper, 0.2), // Light overlay for light mode
          backdropFilter: "blur(2px)", // Optional: add blur effect to backdrop
        }
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          width: { xs: "90%", sm: 500 },
          borderRadius: 2,
          boxShadow: isDarkMode 
            ? "0 10px 40px rgba(0,0,0,0.3)"
            : "0 10px 40px rgba(0,0,0,0.1)",
          overflow: "hidden",
          maxWidth: 500,
          mx: "auto",
          background: isDarkMode
            ? alpha(theme.palette.background.paper, 0.95)
            : alpha(theme.palette.background.paper, 0.98),
          backdropFilter: "blur(10px)",
          border: isDarkMode
            ? `1px solid ${alpha(theme.palette.divider, 0.3)}`
            : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          pb: 2,
          pt: 3,
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
            : "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "relative",
          textAlign: "center"
        }}
      >
        <Typography 
          fontSize="2.25rem"
          fontWeight="600"
          color="primary.main"
          gutterBottom
        >
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your account
        </Typography>
        <IconButton
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: isDarkMode ? "grey.300" : "grey.600",
            bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.8) : "white",
            boxShadow: 1,
            border: isDarkMode ? `1px solid ${alpha(theme.palette.divider, 0.2)}` : "none",
            "&:hover": {
              bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.9) : "grey.50",
              transform: "rotate(90deg)",
              transition: "transform 0.2s"
            }
          }}
          onClick={() => navigate("/")}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              autoFocus
              variant="outlined"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              inputRef={emailRef}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: isDarkMode 
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                  "&:hover fieldset": {
                    borderColor: "primary.light",
                  },
                  "& fieldset": {
                    borderColor: alpha(theme.palette.divider, isDarkMode ? 0.3 : 0.2),
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isDarkMode ? "grey.300" : "text.secondary",
                }
              }}
            />
            
            <PasswordField 
              passwordRef={passwordRef}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: isDarkMode 
                    ? alpha(theme.palette.background.paper, 0.6)
                    : alpha(theme.palette.background.paper, 0.8),
                  "&:hover fieldset": {
                    borderColor: "primary.light",
                  },
                  "& fieldset": {
                    borderColor: alpha(theme.palette.divider, isDarkMode ? 0.3 : 0.2),
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isDarkMode ? "grey.300" : "text.secondary",
                }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3}}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <PulseLoader color={isDarkMode ? theme.palette.primary.light : "#005fff"} size={32} />
            </Box>
          ) : (
            <Button 
              type="submit" 
              variant="contained" 
              endIcon={<Send />}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "600",
                textTransform: "none",
                background: theme.customStyles?.neonGradient || "linear-gradient(45deg, #6C63FF, #FF6584)",
                boxShadow: isDarkMode
                  ? "0 4px 15px rgba(108, 99, 255, 0.4)"
                  : "0 4px 12px rgba(0, 95, 255, 0.2)",
                "&:hover": {
                  boxShadow: isDarkMode
                    ? "0 6px 20px rgba(108, 99, 255, 0.6)"
                    : "0 6px 16px rgba(0, 95, 255, 0.3)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease"
              }}
            >
              Sign In
            </Button>
          )}
        </DialogActions>

        <Box sx={{ px: 3, py: 2, textAlign: "center" }}>
          <GoogleOneTapLogin />
        </Box>

        <Box sx={{ 
          display: "flex", 
          flexDirection: "column",
          gap: 1,
          p: 2.5,
          bgcolor: isDarkMode 
            ? alpha(theme.palette.background.default, 0.5)
            : "grey.50",
          borderTop: "1px solid",
          borderColor: "divider"
        }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: 1
          }}>
            <Typography variant="body2" color="text.secondary">
              Forgot your password?
            </Typography>
            <Button 
              onClick={handlePasswordReset}
              sx={{
                textTransform: "none",
                fontWeight: "600",
                color: "primary.main",
                minWidth: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "primary.light",
                }
              }}
            >
              Reset it
            </Button>
          </Box>

          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: 1
          }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?
            </Typography>
            <Button 
              onClick={() => navigate("/register")}
              sx={{
                textTransform: "none",
                fontWeight: "600",
                color: "primary.main",
                minWidth: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                  color: "primary.light",
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </form>
    </Dialog>
  );
};

export default Login;