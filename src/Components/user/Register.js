// Register.js
import { useRef, useState, useContext, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import GoogleOneTapLogin from "./GoogleOneTapLogin";
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
import { sanitizeName, validateEmail, sanitizePassword } from "../../utils/sanitize";

const Register = () => {
  const { dispatch } = useValue();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(Context);

  // Get theme from context and Material-UI
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
    };
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawFullName = nameRef.current.value;
    const rawEmail = emailRef.current.value;
    const rawPassword = passwordRef.current.value;
    const rawConfirmPassword = confirmPasswordRef.current.value;

    // Sanitize inputs
    const fullName = sanitizeName(rawFullName);
    const { isValid, sanitized: email } = validateEmail(rawEmail);
    const password = sanitizePassword(rawPassword);
    const confirmPassword = sanitizePassword(rawConfirmPassword);

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
      navigate("/profile"); // Redirect to profile after registration
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
        sx={{
          borderRadius: 2,
          width: { xs: "90%", sm: 500 },
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: isDarkMode
            ? "0 10px 40px rgba(0,0,0,0.3)"
            : "0 10px 40px rgba(0,0,0,0.1)",
          background: isDarkMode
            ? alpha(theme.palette.background.paper, 0.95)
            : alpha(theme.palette.background.paper, 0.98),
          backdropFilter: "blur(10px)",
          border: isDarkMode
            ? `1px solid ${alpha(theme.palette.divider, 0.3)}`
            : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          // Optional: make scrollbar more subtle
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: "4px",
            margin: "20px 0",
          },
          "&::-webkit-scrollbar-thumb": {
            background: isDarkMode
              ? alpha(theme.palette.primary.main, 0.7)
              : alpha(theme.palette.primary.main, 0.7),
            borderRadius: "4px",
            "&:hover": {
              background: isDarkMode
                ? alpha(theme.palette.secondary.main, 0.7)
                : alpha(theme.palette.secondary.main, 0.7),
            },
          },
        }}
      >
        <Box
          sx={{
            pb: 1,
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
            Create Account
          </Typography>
          <Typography
            sx={{
              mb: 3,
              color: isDarkMode ? theme.palette.text.secondary : "text.secondary",
              textAlign: "center"
            }}
          >
            Join us today - start your journey
          </Typography>
          <IconButton
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
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
        </Box>

        <form onSubmit={handleSubmit} noValidate>
          <Box sx={{ pb: 2, textAlign: "center", pt: 3 }}>
            <GoogleOneTapLogin />
          </Box>

          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              color: isDarkMode ? theme.palette.text.secondary : "text.secondary",
              mb: 3,
              px: 3,
              "&::before, &::after": {
                content: '""',
                flex: 1,
                borderBottom: "2px solid",
                borderColor: "divider",
                mx: 2,
              },
            }}
          >
            OR
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 3 }}>
            <TextField
              autoFocus
              variant="outlined"
              id="name"
              label="Full Name"
              type="text"
              fullWidth
              inputRef={nameRef}
              inputProps={{ minLength: 2 }}
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

            <TextField
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
              id="password"
              label="password"
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
              passwordRef={confirmPasswordRef}
              id="confirmPassword"
              label="Confirm Password"
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

          <Box sx={{ px: 3, py: 2.5 }}>
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
                Create Account
              </Button>
            )}
          </Box>
        </form>

        <Box sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          p: 2.5,
          bgcolor: isDarkMode
            ? alpha(theme.palette.background.default, 0.5)
            : "grey.50",
          borderTop: "1px solid",
          borderColor: "divider"
        }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?
          </Typography>
          <Button
            onClick={() => navigate("/login")}
            sx={{
              textTransform: "none",
              fontWeight: "600",
              color: "primary.main",
              "&:hover": {
                bgcolor: "transparent",
                color: "primary.light",
              }
            }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;