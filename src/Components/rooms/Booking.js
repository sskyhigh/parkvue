import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { useValue, Context } from "../../context/ContextProvider";
import {
  doc,
  collection,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  increment,
  runTransaction,
} from "firebase/firestore";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Typography,
  Stack,
  Divider,
  CircularProgress,
  useTheme,
  Chip,
  Alert,
  Paper,
  Avatar,
  Container,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Home,
  LocationOn,
  AccessTime,
  Security,
  DirectionsCar,
  LocalParking as ParkingIcon,
  Garage as GarageIcon,
  SquareFoot,
  AttachMoney,
  CalendarToday,
  Person,
  Payment,
  CheckCircle,
  Warning,
  Info,
} from "@mui/icons-material";
import NotFound from "../../NotFound/NotFound";
import { sanitizeText, sanitizeCardNumber, sanitizeCVV } from "../../utils/sanitize";
import { getRoomCapacity, isCommercialListing, isRoomAvailable } from "../../utils/capacity";

// ---------- helper utilities ----------
const luhnCheck = (num) => {
  const s = num.replace(/\D/g, "");
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s.charAt(i), 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const detectCardBrand = (num) => {
  const s = num.replace(/\D/g, "");
  if (/^4/.test(s)) return "Visa";
  if (/^5[1-5]/.test(s) || /^2(2[2-9]|[3-6]\d|7[01])/.test(s)) return "Mastercard";
  if (/^3[47]/.test(s)) return "Amex";
  if (/^6(?:011|5)/.test(s)) return "Discover";
  return "Unknown";
};

const validExpiry = (exp) => {
  const cleaned = exp.replace(/\s+/g, "");
  const m = cleaned.match(/^(\d{1,2})\/(\d{2,4})$/);
  if (!m) return false;
  let month = parseInt(m[1], 10);
  let year = parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  if (m[2].length === 2) {
    year += 2000;
  }
  const now = new Date();
  const expiry = new Date(year, month, 1);
  return expiry > new Date(now.getFullYear(), now.getMonth(), 1);
};
// ---------- end helpers ----------

const Booking = () => {
  const { dispatch } = useValue();
  const { currentUser } = useContext(Context);
  const { state } = useLocation();
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const chipSx = {
    maxWidth: '100%',
    '& .MuiChip-label': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
      display: 'block',
    },
  };

  const bookingDraftKey = `parkvue_booking_draft:${roomId || "unknown"}`;

  // room data state
  const [room, setRoom] = useState(
    location.state?.room ?? undefined
  );
  const self = state?.self || (currentUser && room && currentUser.uid === room.createdBy);

  const [loading, setLoading] = useState(!location.state?.room);

  // payment form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // auth-required dialog
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // booking duration state
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");
  const [spacesRequested, setSpacesRequested] = useState(1);
  const [duration, setDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalWithFee, setTotalWithFee] = useState(0);

  const saveBookingDraft = () => {
    try {
      if (!roomId) return;
      const draft = {
        roomId,
        bookingStart,
        bookingEnd,
        spacesRequested,
        cardName,
        cardNumber,
        cardExpiry,
        cardCvc,
        savedAt: Date.now(),
      };
      sessionStorage.setItem(bookingDraftKey, JSON.stringify(draft));
    } catch {
      // best-effort: ignore storage failures
    }
  };

  const clearBookingDraft = () => {
    try {
      if (!roomId) return;
      sessionStorage.removeItem(bookingDraftKey);
    } catch {
      // ignore
    }
  };

  // Restore draft after login/signup (or after accidental navigation)
  useEffect(() => {
    if (!roomId) return;

    // Only restore into a fresh form (avoid overwriting active edits)
    const looksEmpty =
      !bookingStart &&
      !bookingEnd &&
      (!spacesRequested || spacesRequested === 1) &&
      !cardName &&
      !cardNumber &&
      !cardExpiry &&
      !cardCvc;

    if (!looksEmpty) return;

    try {
      const raw = sessionStorage.getItem(bookingDraftKey);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft || draft.roomId !== roomId) return;

      if (typeof draft.bookingStart === "string") setBookingStart(draft.bookingStart);
      if (typeof draft.bookingEnd === "string") setBookingEnd(draft.bookingEnd);
      if (draft.spacesRequested != null) {
        const n = Number.parseInt(String(draft.spacesRequested), 10);
        setSpacesRequested(Number.isFinite(n) && n > 0 ? n : 1);
      }

      if (typeof draft.cardName === "string") setCardName(draft.cardName);
      if (typeof draft.cardNumber === "string") setCardNumber(draft.cardNumber);
      if (typeof draft.cardExpiry === "string") setCardExpiry(draft.cardExpiry);
      if (typeof draft.cardCvc === "string") setCardCvc(draft.cardCvc);

      dispatch({
        type: "UPDATE_ALERT",
        payload: { open: true, severity: "info", message: "Restored your booking details." },
      });
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const remainingCapacity = getRoomCapacity(room);
  const availableNow = isRoomAvailable(room);

  // fetch room data if not passed via state
  useEffect(() => {
    const fetchRoomById = async () => {
      if (room) {
        setLoading(false);
        return;
      }

      try {
        const roomRef = doc(db, "rooms", roomId);
        const snap = await getDoc(roomRef);

        if (snap.exists()) {
          setRoom({ id: snap.id, ...snap.data() });
        } else {
          setRoom(null);
        }
      } catch (err) {
        console.error("Failed to fetch room:", err);
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomById();
  }, [room, roomId]);

  // Keep spacesRequested within bounds as room/capacity changes
  useEffect(() => {
    if (!room) return;
    const cap = getRoomCapacity(room);
    const max = Math.max(1, cap);
    setSpacesRequested((prev) => {
      const next = Number.isFinite(prev) ? prev : 1;
      return Math.min(Math.max(1, next), max);
    });
  }, [room]);

  // Calculate duration and total price when booking dates change
  useEffect(() => {
    if (bookingStart && bookingEnd && room) {
      const start = new Date(bookingStart);
      const end = new Date(bookingEnd);

      if (end > start) {
        const durationMs = end - start;
        const durationMinutes = durationMs / (1000 * 60);
        const durationHours = Math.ceil(durationMinutes / 60); // Round up to nearest hour

        setDuration(durationHours);

        // Calculate total price per space (daily rate / 24 for hourly rate)
        const hourlyRate = (room.price || 0) / 24;
        const calculatedTotal = durationHours * hourlyRate * Math.max(1, spacesRequested);
        setTotalPrice(calculatedTotal);

        // Calculate service fee and total with fee
        const calculatedServiceFee = calculatedTotal * 0.1;
        setServiceFee(calculatedServiceFee);
        setTotalWithFee(calculatedTotal + calculatedServiceFee);
      } else {
        setDuration(0);
        setTotalPrice(0);
        setServiceFee(0);
        setTotalWithFee(0);
      }
    } else {
      setDuration(0);
      setTotalPrice(0);
      setServiceFee(0);
      setTotalWithFee(0);
    }
  }, [bookingStart, bookingEnd, room, spacesRequested]);

  // Increment view count
  useEffect(() => {
    const incrementView = async () => {
      if (!currentUser?.uid || !room?.id) return;
      try {
        const viewRef = doc(db, 'rooms', room.id, 'views', currentUser.uid);
        const viewSnap = await getDoc(viewRef);
        if (!viewSnap.exists()) {
          await setDoc(viewRef, { viewedAt: serverTimestamp() });
          const roomRef = doc(db, 'rooms', room.id);
          await updateDoc(roomRef, { viewCount: increment(1) });
        }
      } catch (error) {
        console.error('Error incrementing view:', error);
      }
    };
    incrementView();
  }, [currentUser, room]);

  // validate locally
  const validate = () => {
    const err = {};
    if (!cardName.trim()) err.cardName = "Name on card required";
    const digits = cardNumber.replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(digits)) err.cardNumber = "Invalid card number format";
    else if (!luhnCheck(digits)) err.cardNumber = "Invalid card number (failed checksum)";
    if (!validExpiry(cardExpiry)) err.cardExpiry = "Invalid or expired expiry date (MM/YY)";
    if (!/^\d{3,4}$/.test(cardCvc)) err.cardCvc = "CVC must be 3 or 4 digits";

    // Validate booking dates
    if (!bookingStart) err.bookingStart = "Booking start date and time required";
    if (!bookingEnd) err.bookingEnd = "Booking end date and time required";

    if (bookingStart && bookingEnd) {
      const start = new Date(bookingStart);
      const end = new Date(bookingEnd);

      if (end <= start) {
        err.bookingEnd = "End date must be after start date";
      }

      // Check if booking is within availability
      if (room.availableFrom && room.availableTo) {
        const availStart = new Date(room.availableFrom);
        const availEnd = new Date(room.availableTo);

        if (start < availStart || end > availEnd) {
          err.bookingStart = "Booking must be within availability period";
        }
      }
    }

    // Capacity validation (new model)
    const cap = getRoomCapacity(room);
    if (cap <= 0) {
      err.capacity = "This listing has no spaces available right now";
    } else {
      const requested = Number.isFinite(spacesRequested) ? spacesRequested : 1;
      if (requested < 1) err.capacity = "You must book at least 1 space";
      else if (requested > cap) err.capacity = `Only ${cap} space${cap !== 1 ? 's' : ''} available`;
      else if (cap <= 1 && requested !== 1) err.capacity = "Only 1 space remaining for this listing";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !currentUser.uid) {
      setLoginDialogOpen(true);
      return;
    }
    if (!validate()) return;

    setProcessing(true);

    try {
      // simulate payment processing delay
      await new Promise((res) => setTimeout(res, 900));

      // Sanitize card inputs
      const sanitizedCardNumber = sanitizeCardNumber(cardNumber);
      sanitizeText(cardName);
      sanitizeCVV(cardCvc);

      // build reservation payload
      const cardDigits = sanitizedCardNumber.replace(/\D/g, "");
      const last4 = cardDigits.slice(-4);
      const cardBrand = detectCardBrand(sanitizedCardNumber);

      const reservationPayload = {
        reserverId: currentUser.uid,
        ownerId: room.createdBy,
        roomId: room.id,
        spaces: Math.max(1, spacesRequested),
        unitPrice: room.price || 0,
        bookingStart: bookingStart,
        bookingEnd: bookingEnd,
        duration: duration,
        // Payment breakdown
        // totalPrice: booking subtotal (host payout when service fee is charged to renter on top)
        totalPrice: totalPrice,
        serviceFee: serviceFee,
        totalPaid: totalWithFee,
        hostPayout: totalPrice,
        paymentMethod: "card",
        paymentDetails: {
          cardBrand,
          last4,
        },
        reservedAt: serverTimestamp(),
      };

      // Atomically reserve and decrement capacity
      const roomRef = doc(db, "rooms", room.id);
      const requestedSpaces = Math.max(1, spacesRequested);

      // Resolve owner's user document (Firestore id) ahead of time.
      // We can't run collection queries inside Firestore transactions.
      let ownerUserRef = null;
      try {
        const usersRef = collection(db, "users");
        const ownerQ = query(usersRef, where("uid", "==", room.createdBy));
        const ownerSnap = await getDocs(ownerQ);
        if (!ownerSnap.empty) {
          ownerUserRef = doc(db, "users", ownerSnap.docs[0].id);
        }
      } catch (e) {
        // Non-fatal: booking should still succeed even if stats cannot be updated.
        ownerUserRef = null;
      }

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(roomRef);
        if (!snap.exists()) throw new Error("Listing not found");
        const roomData = { id: snap.id, ...snap.data() };
        const currentCap = getRoomCapacity(roomData);
        if (currentCap < requestedSpaces) {
          throw new Error(`Not enough spaces available (requested ${requestedSpaces}, available ${currentCap})`);
        }
        const newCap = currentCap - requestedSpaces;

        const reservationDocRef = doc(collection(db, "reservations"));
        transaction.set(reservationDocRef, reservationPayload);

        transaction.update(roomRef, {
          // Keep legacy boolean out of the way: once capacity exists, we consider `available` deprecated.
          available: true,
          capacity: newCap,
          lastReservedBy: currentUser.uid,
          updatedAt: serverTimestamp(),
        });

        // Update host earnings only when the booking transaction succeeds.
        // Current model: renter pays serviceFee on top, so host payout is the subtotal (totalPrice).
        if (ownerUserRef) {
          transaction.update(ownerUserRef, {
            totalEarnings: increment(Number.isFinite(totalPrice) ? totalPrice : 0),
            lastEarningUpdate: serverTimestamp(),
          });
        }
      });

      dispatch({
        type: "UPDATE_ALERT",
        payload: { open: true, severity: "success", message: "Payment accepted — room reserved!" },
      });

      clearBookingDraft();

      // navigate to rooms list
      navigate("/dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      dispatch({
        type: "UPDATE_ALERT",
        payload: { open: true, severity: "error", message: err.message || "Booking failed" },
      });
    } finally {
      setProcessing(false);
    }
  };

  // small UI helpers
    const priceNice = room ? (typeof room.price === "number" ? room.price.toFixed(2) : room.price) : '';

  // Define keyframe animations
  const fadeIn = {
    "@keyframes fadeIn": {
      "0%": {
        opacity: 0,
        transform: "translateY(20px)",
      },
      "100%": {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
  };

  const slideIn = {
    "@keyframes slideIn": {
      "0%": {
        opacity: 0,
        transform: "translateX(-20px)",
      },
      "100%": {
        opacity: 1,
        transform: "translateX(0)",
      },
    },
  };

  const pulse = {
    "@keyframes pulse": {
      "0%": {
        boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`,
      },
      "70%": {
        boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`,
      },
      "100%": {
        boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
      },
    },
  };

  // Skeleton Loader Component
  const RoomDetailsSkeleton = ({ self = false }) => (
  <Box
    sx={{
      minHeight: "auto",
      background: theme.palette.customStyles?.heroBackground || theme.palette.background.default,
      pt: 2,
      pb: 3,
    }}
  >
    <Container maxWidth="lg">
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ width: '100%' }}>
            <Skeleton width="60%" height={40} />
            <Skeleton width="40%" height={24} sx={{ mt: 1 }} />
          </Box>
        </Stack>
        <Skeleton variant="rectangular" height={1} />
      </Box>

      <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
        {/* Left: Room Details Skeleton */}
        <Grid item xs={12} md={self ? 12 : 7}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: "background.paper",
            }}
          >
            {/* Room Image Skeleton */}
            <Skeleton 
              variant="rectangular" 
              height={340} 
              width="100%" 
              sx={{ 
                borderRadius: 0,
                transform: 'none'
              }}
            />

            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Room Title and Status */}
                <Box>
                  <Skeleton width="80%" height={36} sx={{ mb: 2 }} />
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Skeleton variant="rounded" width={110} height={32} />
                    <Skeleton variant="rounded" width={140} height={32} sx={{ mx: 1 }} />
                    <Skeleton variant="rounded" width={90} height={32} />
                  </Stack>
                </Box>

                <Divider />

                {/* Description */}
                <Box>
                  <Skeleton width="30%" height={28} sx={{ mb: 1.5 }} />
                  <Skeleton width="100%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton width="95%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton width="90%" height={20} />
                </Box>

                <Divider />

                {/* Video Tour Skeleton (if applicable) */}
                <Box>
                  <Skeleton width="35%" height={28} sx={{ mb: 1.5 }} />
                  <Skeleton 
                    variant="rectangular" 
                    height={300} 
                    width="100%"
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                <Divider />

                {/* Property Details */}
                <Box>
                  <Skeleton width="40%" height={28} sx={{ mb: 2 }} />
                  {[...Array(6)].map((_, i) => (
                    <Stack key={i} direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton width={i === 0 ? "90%" : "70%"} height={20} />
                    </Stack>
                  ))}
                </Box>

                <Divider />

                {/* Amenities */}
                <Box>
                  <Skeleton width="25%" height={24} sx={{ mb: 1.5 }} />
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {[...Array(8)].map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="rounded"
                        width={80 + Math.random() * 40}
                        height={32}
                        sx={{ mb: 1, mr: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Upload Date */}
                <Box>
                  <Skeleton width="40%" height={16} />
                </Box>
              </Stack>
            </CardContent>
          </Paper>
        </Grid>

        {/* Right: Payment Form Skeleton (only if not self) */}
        {!self && (
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton width="60%" height={36} />
                </Stack>
                <Skeleton width="80%" height={20} />
              </Box>

              <Stack spacing={3}>
                {/* Booking Duration Section */}
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                  <Skeleton width="50%" height={28} sx={{ mb: 2 }} />
                  <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" height={40} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" height={40} />
                    </Grid>
                  </Grid>
                  <Skeleton 
                    variant="rectangular" 
                    height={60} 
                    width="100%"
                    sx={{ mt: 2, borderRadius: 1 }}
                  />
                </Box>

                <Divider />

                {/* Card Details */}
                <Box>
                  <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={40} />
                </Box>

                <Box>
                  <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={40} />
                  <Skeleton width="30%" height={16} sx={{ mt: 0.5 }} />
                </Box>

                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  <Grid item xs={6}>
                    <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={40} />
                  </Grid>
                  <Grid item xs={6}>
                    <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={40} />
                  </Grid>
                </Grid>

                <Divider />

                {/* Price Summary */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Skeleton width="40%" height={24} />
                    <Skeleton width="30%" height={24} />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Skeleton width="35%" height={20} />
                    <Skeleton width="25%" height={20} />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Skeleton width="35%" height={20} />
                    <Skeleton width="25%" height={20} />
                  </Stack>
                  <Skeleton variant="rectangular" height={1} sx={{ my: 1.5 }} />
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Skeleton width="40%" height={28} />
                    <Skeleton width="30%" height={28} />
                  </Stack>
                </Paper>

                {/* Submit Button */}
                <Skeleton 
                  variant="rectangular" 
                  height={48} 
                  width="100%"
                  sx={{ borderRadius: 1 }}
                />

                {/* Security Note */}
                <Box sx={{ textAlign: "center" }}>
                  <Skeleton width="60%" height={16} sx={{ mx: "auto" }} />
                </Box>

                {/* Demo Note */}
                <Skeleton 
                  variant="rectangular" 
                  height={60} 
                  width="100%"
                  sx={{ borderRadius: 2 }}
                />
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  </Box>
);

if (loading) {
  return <RoomDetailsSkeleton self={self} />;
}

if (!loading && !room) {
  return <NotFound information="parking space" />;
}

  return (
    <Box
      sx={{
        minHeight: "auto",
        background: theme.palette.customStyles?.heroBackground || theme.palette.background.default,
        pt: 2,
        pb: 3,
        ...fadeIn,
        animation: "fadeIn 0.6s ease-out",
      }}
    >
      <Container maxWidth="lg">
        <Dialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
          aria-labelledby="login-required-title"
          aria-describedby="login-required-description"
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="login-required-title">Log in required</DialogTitle>
          <DialogContent>
            <DialogContentText id="login-required-description">
              You need to log in to complete this booking. Your entered booking details will be saved so you can
              continue after signing in.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLoginDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setLoginDialogOpen(false);
                saveBookingDraft();
                navigate("/login", {
                  state: { redirectTo: location.pathname + location.search },
                  replace: false,
                });
              }}
            >
              Go to login
            </Button>
          </DialogActions>
        </Dialog>

        {/* Header Section */}
        <Box sx={{ mb: 4, ...slideIn, animation: "slideIn 0.5s ease-out" }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <Home />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                }}
              >
                Complete Your Booking
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Secure your spot with easy payment
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>

        <Grid container spacing={4}>
          {/* Left: Room Details */}
          <Grid item xs={12} md={self ? 12 : 7}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: "background.paper",
                animation: "fadeIn 0.7s ease-out",
              }}
            >
              {/* Room Image with Overlay */}
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="340"
                  image={room?.images?.[0] || "/placeholder-park.jpg"}
                  alt={room.title}
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                {self && (
                  <Fade in={self}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.85)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                        p: 4,
                        textAlign: "center",
                      }}
                    >
                      <Warning sx={{ fontSize: 48, mb: 2, color: theme.palette.warning.light }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        You Own This Room
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400 }}>
                        You cannot book your own property. Manage your listing from the dashboard.
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => navigate("/dashboard")}
                      >
                        Go to Dashboard
                      </Button>
                    </Box>
                  </Fade>
                )}
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Room Title and Status */}
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.text.primary,
                        mb: 1.5,
                      }}
                    >
                      {room.title}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      alignItems="center"
                      flexWrap="wrap"
                      sx={{
                        width: '100%',
                        '& .MuiChip-root': { maxWidth: '100%' },
                      }}
                    >
                      <Chip
                        icon={<CheckCircle fontSize="small" />}
                        label={availableNow ? "Available" : "Reserved"}
                        color={availableNow ? "success" : "error"}
                        sx={{ ...chipSx, fontWeight: 600 }}
                      />
                      <Chip
                        icon={isCommercialListing(room) ? <GarageIcon fontSize="small" /> : <ParkingIcon fontSize="small" />}
                        label={isCommercialListing(room) ? "Commercial" : "Single"}
                        color="secondary"
                        sx={{ ...chipSx, fontWeight: 700 }}
                      />
                      <Chip
                        icon={<DirectionsCar fontSize="small" />}
                        label={`Spaces left: ${remainingCapacity}`}
                        color={availableNow ? "primary" : "default"}
                        variant={availableNow ? "filled" : "outlined"}
                        sx={{ ...chipSx, fontWeight: 600 }}
                      />
                      <Chip
                        icon={<Person fontSize="small" />}
                        label={`Owner: ${room.ownerName || "Anonymous"}`}
                        color="default"
                        variant="outlined"
                        onClick={() => {
                          if (room.createdBy) {
                            navigate(`/seller/${room.createdBy}`);
                          }
                        }}
                        clickable={!!room.createdBy}
                        sx={{
                          ...chipSx,
                          cursor: room.createdBy ? 'pointer' : 'default',
                          width: { xs: '100%', sm: 'auto' },
                          justifyContent: 'flex-start',
                        }}
                      />
                      <Chip
                        icon={<AttachMoney fontSize="small" />}
                        label={`$${priceNice}`}
                        color="primary"
                        sx={{ ...chipSx, fontWeight: 600 }}
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Description */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {room.description}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Video Tour */}
                  {room.video && (
                    <>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}
                        >
                          Video Tour
                        </Typography>
                        <CardMedia
                          component="video"
                          controls
                          src={room.video}
                          sx={{
                            width: "100%",
                            height: 300,
                            borderRadius: 2,
                            bgcolor: "black",
                            display: "block",
                          }}
                        />
                      </Box>
                      <Divider />
                    </>
                  )}

                  {/* Room Details List */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}
                    >
                      Property Details
                    </Typography>
                    <List dense disablePadding>
                      <ListItem sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <LocationOn color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            room.fullAddress ||
                            `${room.address || ""} ${room.city || ""}, ${room.state || ""} ${room.zipCode || ""
                            }`
                          }
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <AccessTime color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Access hours: ${room.accessHours || "Flexible"}`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Security color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Security: ${(room.securityFeatures || []).length
                            ? (room.securityFeatures || []).join(", ")
                            : "Standard"
                            }`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <DirectionsCar color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Vehicle types: ${(room.vehicleTypes || []).join(", ") || "All types"
                            }`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <SquareFoot color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Size: ${room.size || "Standard"}`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                      {room.availableFrom && room.availableTo && (
                        <ListItem sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CalendarToday color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Available: ${new Date(room.availableFrom).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })} - ${new Date(room.availableTo).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}`}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>

                  <Divider />

                  {/* Amenities */}
                  {(room.amenities || []).length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1.5, color: theme.palette.text.primary }}
                      >
                        Amenities
                      </Typography>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {(room.amenities || []).map((amenity, index) => (
                          <Chip
                            key={index}
                            label={amenity}
                            size="small"
                            variant="outlined"
                            sx={{ ...chipSx, mb: 1 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Upload Date */}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      <CalendarToday sx={{ fontSize: 12, verticalAlign: "middle", mr: 0.5 }} />
                      Uploaded: {room.createdAt ? new Date(room.createdAt).toLocaleString() : "—"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Paper>
          </Grid>

          {/* Right: Payment Form */}
          {!self && (
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: "background.paper",
                  ...pulse,
                  animation: "fadeIn 0.8s ease-out, pulse 2s infinite 1s",
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                      }}
                    >
                      <Payment />
                    </Avatar>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                      }}
                    >
                      Secure Payment
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Complete your booking with our secure payment system
                  </Typography>
                </Box>

                {!availableNow && (
                  <Alert
                    severity="warning"
                    sx={{ mb: 3, borderRadius: 2 }}
                    icon={<Warning fontSize="small" />}
                  >
                    This listing currently has no spaces available. Please check back later or explore other
                    available listings.
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    {/* Booking Duration Section */}
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                        Booking Duration
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Start Date & Time
                          </Typography>
                          <TextField
                            type="datetime-local"
                            value={bookingStart}
                            onChange={(e) => setBookingStart(e.target.value)}
                            error={!!errors.bookingStart}
                            helperText={errors.bookingStart}
                            fullWidth
                            size="small"
                            disabled={!availableNow || processing}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            End Date & Time
                          </Typography>
                          <TextField
                            type="datetime-local"
                            value={bookingEnd}
                            onChange={(e) => setBookingEnd(e.target.value)}
                            error={!!errors.bookingEnd}
                            helperText={errors.bookingEnd}
                            fullWidth
                            size="small"
                            disabled={!availableNow || processing}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Spaces
                          </Typography>
                          <TextField
                            type="number"
                            value={spacesRequested}
                            onChange={(e) => {
                              const next = Number.parseInt(e.target.value, 10);
                              const cap = getRoomCapacity(room);
                              const upper = Math.max(1, cap);
                              setSpacesRequested(Number.isFinite(next) ? Math.min(Math.max(1, next), upper) : 1);
                            }}
                            error={!!errors.capacity}
                            helperText={errors.capacity || (remainingCapacity <= 1 ? "Only 1 space remaining" : "Book multiple spaces if needed")}
                            fullWidth
                            size="small"
                            disabled={!availableNow || processing || remainingCapacity <= 1}
                            inputProps={{ min: 1, max: Math.max(1, remainingCapacity), step: 1 }}
                          />
                        </Grid>
                      </Grid>

                      {duration > 0 && (
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            Duration: {duration} hour{duration !== 1 ? 's' : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Hourly Rate: ${(room.price / 24).toFixed(2)}/hr (Daily: ${room.price})
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider />

                    {/* Card Holder Name */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Cardholder Name
                      </Typography>
                      <TextField
                        placeholder="John Smith"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        error={!!errors.cardName}
                        helperText={errors.cardName}
                        fullWidth
                        size="small"
                        disabled={!availableNow || processing}
                      />
                    </Box>

                    {/* Card Number */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Card Number
                      </Typography>
                      <TextField
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, ""); // keep only numbers
                          let formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
                          setCardNumber(formatted);
                        }}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        fullWidth
                        size="small"
                        disabled={!availableNow || processing}
                      />
                      {cardNumber && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          Detected: {detectCardBrand(cardNumber)}
                        </Typography>
                      )}
                    </Box>

                    {/* Expiry and CVC */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Expiry Date
                        </Typography>
                        <TextField
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 3) {
                              value = value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            setCardExpiry(value);
                          }}
                          error={!!errors.cardExpiry}
                          helperText={errors.cardExpiry}
                          fullWidth
                          size="small"
                          disabled={!availableNow || processing}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          CVC
                        </Typography>
                        <TextField
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                          error={!!errors.cardCvc}
                          helperText={errors.cardCvc}
                          fullWidth
                          size="small"
                          disabled={!availableNow || processing}
                        />
                      </Box>
                    </Box>

                    <Divider />

                    {/* Price Summary */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Hourly Rate
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          ${(room.price / 24).toFixed(2)}/hr
                        </Typography>
                      </Stack>
                      {duration > 0 && (
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Duration ({duration} hour{duration !== 1 ? 's' : ''})
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${totalPrice.toFixed(2)}
                          </Typography>
                        </Stack>
                      )}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Service Fee (10%)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${serviceFee.toFixed(2)}
                        </Typography>
                      </Stack>
                      <Divider sx={{ my: 1.5 }} />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          Total Amount
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: theme.palette.primary.main,
                          }}
                        >
                          ${totalWithFee.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Paper>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={!availableNow || processing}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: "1rem",
                        position: "relative",
                        overflow: "hidden",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                          transition: "left 0.5s",
                        },
                        "&:hover::after": {
                          left: "100%",
                        },
                      }}
                    >
                      {processing ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        `Pay $${totalWithFee > 0 ? totalWithFee.toFixed(2) : priceNice} & Confirm Booking`
                      )}
                    </Button>

                    {/* Security Note */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        textAlign: "center",
                        display: "block",
                        mt: 1,
                      }}
                    >
                      <Security sx={{ fontSize: 12, verticalAlign: "middle", mr: 0.5 }} />
                      Your payment is secured with 256-bit SSL encryption
                    </Typography>

                    {/* Demo Note */}
                    <Alert severity="info" sx={{ borderRadius: 2 }} icon={<Info fontSize="small" />}>
                      <Typography variant="caption">
                        Demo mode: No real payment will be processed. All transactions are simulated
                        for demonstration purposes.
                      </Typography>
                    </Alert>
                  </Stack>
                </form>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Booking;