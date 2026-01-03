// Login.js
import { useContext, useRef, useState, useEffect } from "react";
import {
  Button,
  Paper,
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
import { sanitizePassword, validateEmail } from "../../utils/sanitize";

const Login = () => {
  const { dispatch } = useValue();
  const emailRef = useRef();
  const passwordRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(Context);

  const resolveRedirectTo = (value) => {
    if (typeof value !== "string") return "/dashboard";
    if (!value.startsWith("/")) return "/dashboard";
    if (value === "/") return "/dashboard";
    if (value === "/login" || value === "/register") return "/dashboard";
    return value;
  };

  const redirectTo = resolveRedirectTo(location?.state?.redirectTo);

  // Get theme from context and Material-UI
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (currentUser) {
      navigate(redirectTo, { replace: true });
    };
  }, [currentUser, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawEmail = emailRef.current.value;
    const rawPassword = passwordRef.current.value;

    // Sanitize inputs
    const { isValid, sanitized: email } = validateEmail(rawEmail);
    const password = sanitizePassword(rawPassword);

    if (!isValid) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: "Please provide a valid email",
        },
      });
      return;
    }

    if (!password || password.length < 6) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: "Password must be at least 6 characters",
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
        const preferredDoc = querySnapshot.docs.find((d) => d.id === user.uid) || querySnapshot.docs[0];
        const userData = preferredDoc.data();
        // Store userData in localSession
        const merged = { ...(userData || {}), userDocId: preferredDoc.id };
        sessionStorage.setItem("userData", JSON.stringify(merged));
        localStorage.setItem("userData", JSON.stringify(merged));
        setCurrentUser(merged);
        navigate(redirectTo, { replace: true });
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
        errorMessage = "Your account has been disabled. Please contact support.";
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
    if (googleLoading) return;
    const rawEmail = emailRef.current.value;
    const { isValid, sanitized: email } = validateEmail(rawEmail);
    
    if (!isValid) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: "Please provide a valid email",
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
    <Box
      sx={{
        minHeight: 'auto',
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        pt: { xs: 2, sm: 4, md: 6},
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={0}
        sx={{
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
        }}
      >
        <Box
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
            disabled={loading || googleLoading}
            onClick={() => {
              if (loading || googleLoading) return;
              navigate("/");
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit} noValidate>
          <Box sx={{ py: 3, px: 3 }}>
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
          </Box>

          <Box sx={{ px: 3 }}>
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
                disabled={loading || googleLoading}
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
          </Box>

          <Box sx={{ px: 3, py: 2, textAlign: "center" }}>
            <GoogleOneTapLogin onLoadingChange={setGoogleLoading} />
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
                disabled={loading || googleLoading}
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
                onClick={() => {
                  if (loading || googleLoading) return;
                  navigate("/register", { state: { redirectTo } });
                }}
                disabled={loading || googleLoading}
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
      </Paper>
    </Box>
  );
};

export default Login;