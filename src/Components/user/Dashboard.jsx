import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Skeleton,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Paper,
  Container,
  alpha,
  Avatar,
  CardActionArea,
} from "@mui/material";
import {
  Edit,
  Delete,
  ToggleOn,
  ToggleOff,
  MonetizationOn,
  PeopleAlt,
  UploadFile,
  Dashboard as DashboardIcon,
  Home,
  MeetingRoom,
  CalendarMonth,
  PriceCheck,
  Star as StarIcon,
} from "@mui/icons-material";
import { useValue, Context } from "../../context/ContextProvider";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  runTransaction,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoomCapacity, getRoomMaxCapacity, isRoomAvailable, MAX_LISTING_CAPACITY } from "../../utils/capacity";

// UserDashboard component
export default function UserDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useValue();
  const { currentUser } = useContext(Context) || {};

  const chipSx = {
    maxWidth: '100%',
    height: 'auto',
    '& .MuiChip-label': {
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      py: 0.25,
    },
  };

  const formatRoomDate = (value) => {
    if (!value) return "N/A";

    // Firestore Timestamp
    if (typeof value?.toDate === "function") {
      const d = value.toDate();
      return Number.isNaN(d?.getTime?.()) ? "N/A" : d.toLocaleDateString();
    }

    // Firestore Timestamp-like plain object
    if (typeof value === "object" && typeof value.seconds === "number") {
      const d = new Date(value.seconds * 1000);
      return Number.isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
    }

    // ISO string, millis, Date
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
  };

  const formatBookingDateTime = (value) => {
    if (!value) return "—";

    // Firestore Timestamp
    if (typeof value?.toDate === "function") {
      const d = value.toDate();
      if (Number.isNaN(d?.getTime?.())) return "—";
      return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }

    // Firestore Timestamp-like plain object
    if (typeof value === "object" && typeof value.seconds === "number") {
      const d = new Date(value.seconds * 1000);
      if (Number.isNaN(d.getTime())) return "—";
      return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }

    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", {
        state: { redirectTo: location.pathname + location.search },
        replace: true,
      });
    }
  }, [currentUser, navigate, location.pathname, location.search]);

  // local state
  const [myRooms, setMyRooms] = useState([]);
  const [myRoomsLoading, setMyRoomsLoading] = useState(true);

  const [myReservations, setMyReservations] = useState([]); // reservations rows with joined room
  const [myReservationsLoading, setMyReservationsLoading] = useState(true);

  const [editingRoom, setEditingRoom] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);

  const [ratingOpen, setRatingOpen] = useState(false);
  const [ratingRoom, setRatingRoom] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const [releaseOpen, setReleaseOpen] = useState(false);
  const [releaseTarget, setReleaseTarget] = useState(null); // reservation row
  const [releaseCount, setReleaseCount] = useState("1");
  const [releaseSubmitting, setReleaseSubmitting] = useState(false);

  const [userStats, setUserStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
  });

  // Fetch user's uploaded rooms
  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;
    let mounted = true;
    const fetchRooms = async () => {
      setMyRoomsLoading(true);
      try {
        const roomsRef = collection(db, "rooms");
        const q = query(roomsRef, where("createdBy", "==", currentUser.uid));
        const snap = await getDocs(q);
        if (!mounted) return;
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // sort: available first
        data.sort((a, b) => {
          const aAvail = isRoomAvailable(a);
          const bAvail = isRoomAvailable(b);
          if (aAvail === bAvail) return 0;
          return aAvail ? -1 : 1;
        });
        setMyRooms(data);
      } catch (err) {
        console.error(err);
        dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "error", message: err.message || "Failed to load rooms" } });
      } finally {
        setMyRoomsLoading(false);
      }
    };
    fetchRooms();
    return () => { mounted = false; };
  }, [currentUser, dispatch]);

  // Fetch user document with earnings
  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;

    const fetchUserStats = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          setUserStats({
            totalEarnings: userData.totalEarnings || 0,
            totalBookings: userData.totalBookings || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching user stats:", err);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  // Fetch reservations where user is the reserver
  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;
    let mounted = true;
    const fetchReservations = async () => {
      setMyReservationsLoading(true);
      try {
        const resRef = collection(db, "reservations");
        const q = query(resRef, where("reserverId", "==", currentUser.uid));
        const snap = await getDocs(q);
        const reservations = await Promise.all(
          snap.docs.map(async (d) => {
            const r = { id: d.id, ...d.data() };
            // fetch the room data for this reservation (graceful if missing)
            try {
            } catch (e) {
              // ignore
            }
            return r;
          })
        );

        // fetch rooms referenced
        const joined = await Promise.all(
          reservations.map(async (r) => {
            try {
              const roomSnap = await getDocs(query(collection(db, "rooms"), where("id", "==", r.roomId)));
              let roomData = null;
              if (!roomSnap.empty) {
                roomData = { id: roomSnap.docs[0].id, ...roomSnap.docs[0].data() };
              }

              // Check if user has rated this room
              let hasRated = false;
              let userRating = 0;
              if (roomData) {
                const ratingRef = doc(db, 'rooms', roomData.id, 'ratings', currentUser.uid);
                const ratingSnap = await getDoc(ratingRef);
                hasRated = ratingSnap.exists();
                if (hasRated) {
                  userRating = ratingSnap.data().rating;
                }
              }

              return { reservationId: r.id, ...r, room: roomData, hasRated, userRating };
            } catch (err) {
              return { reservationId: r.id, ...r, room: null, hasRated: false };
            }
          })
        );

        if (!mounted) return;
        setMyReservations(joined);
      } catch (err) {
        console.error(err);
        dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "error", message: err.message || "Failed to load reservations" } });
      } finally {
        setMyReservationsLoading(false);
      }
    };
    fetchReservations();
    return () => { mounted = false; };
  }, [currentUser, dispatch]);

  // Handlers: Edit, Save, Delete, Pause/Restore (capacity), Release reservation
  const openEdit = (room) => {
    setEditingRoom(room);
    const currentCap = getRoomCapacity(room);
    const maxCap = Math.min(MAX_LISTING_CAPACITY, getRoomMaxCapacity(room) || currentCap || 1);
    setEditValues({
      title: room.title || "",
      price: room.price || "",
      description: room.description || "",
      maxCapacity: String(maxCap),
      capacity: String(currentCap),
    });
    setEditOpen(true);
  };
  const closeEdit = () => { setEditOpen(false); setEditingRoom(null); setEditValues({}); };

  const handleEditSave = async () => {
    if (!editingRoom) return;
    try {
      const roomRef = doc(db, "rooms", editingRoom.id);

      const parsedMax = Number.parseInt(String(editValues.maxCapacity ?? "").trim(), 10);
      const parsedCap = Number.parseInt(String(editValues.capacity ?? "").trim(), 10);

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(roomRef);
        if (!snap.exists()) throw new Error('Room not found');
        const data = { id: snap.id, ...snap.data() };
        const currentCap = getRoomCapacity(data);
        const currentMax = getRoomMaxCapacity(data) || currentCap || 1;

        const nextMax = Number.isFinite(parsedMax)
          ? Math.min(MAX_LISTING_CAPACITY, Math.max(1, parsedMax))
          : Math.min(MAX_LISTING_CAPACITY, currentMax);
        const nextCapRaw = Number.isFinite(parsedCap) ? Math.max(0, parsedCap) : currentCap;
        const nextCap = Math.min(nextMax, nextCapRaw);

        transaction.update(roomRef, {
          title: editValues.title,
          price: editValues.price,
          description: editValues.description,
          maxCapacity: nextMax,
          capacity: nextCap,
          // legacy compatibility: once capacity is present, deprecate boolean
          available: true,
          updatedAt: serverTimestamp(),
        });
      });
      // refresh
      setMyRooms((prev) =>
        prev.map((r) => {
          if (r.id !== editingRoom.id) return r;
          const maxCapacity = Math.min(
            MAX_LISTING_CAPACITY,
            Math.max(1, Number.parseInt(String(editValues.maxCapacity ?? "1"), 10) || getRoomMaxCapacity(r) || 1)
          );
          const capacity = Math.min(maxCapacity, Math.max(0, Number.parseInt(String(editValues.capacity ?? "0"), 10) || getRoomCapacity(r)));
          return { ...r, ...editValues, maxCapacity, capacity };
        })
      );
      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "success", message: "Room updated" } });
      closeEdit();
    } catch (err) {
      console.error(err);
      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "error", message: err.message || "Update failed" } });
    }
  };

  const confirmAction = (payload) => { setConfirmPayload(payload); setConfirmOpen(true); };

  const unreserveReservation = async ({ kind, reservationId, roomId, count }) => {
    const requestedRelease = Math.max(1, Number.parseInt(String(count ?? 1), 10) || 1);
    if (!reservationId) throw new Error('Missing reservation id');

    const resRef = doc(db, "reservations", reservationId);
    const roomRef = roomId ? doc(db, "rooms", roomId) : null;

    // Resolve host's user doc (Firestore id) outside the transaction.
    // Prefer the ownerId stored on the reservation; fallback to room.createdBy.
    let hostUserRef = null;
    try {
      let hostUid = null;
      const resSnapOutside = await getDoc(resRef);
      if (resSnapOutside.exists()) {
        const resData = resSnapOutside.data() || {};
        hostUid = resData.ownerId || resData.createdBy || null;
      }
      if (!hostUid && roomRef) {
        const roomSnapOutside = await getDoc(roomRef);
        if (roomSnapOutside.exists()) {
          const roomData = roomSnapOutside.data() || {};
          hostUid = roomData.createdBy || null;
        }
      }
      if (hostUid) {
        const usersRef = collection(db, "users");
        const uq = query(usersRef, where("uid", "==", hostUid));
        const us = await getDocs(uq);
        if (!us.empty) {
          hostUserRef = doc(db, "users", us.docs[0].id);
        }
      }
    } catch (e) {
      hostUserRef = null;
    }

    let delta = 0;
    let updatedReservationSpaces = null;
    let earningsDelta = 0;

    await runTransaction(db, async (transaction) => {
      // IMPORTANT: all reads must happen before any writes.
      const resSnap = await transaction.get(resRef);
      if (!resSnap.exists()) throw new Error('Reservation not found');
      const resData = resSnap.data() || {};

      const roomSnap = roomRef ? await transaction.get(roomRef) : null;
      const roomData = roomSnap && roomSnap.exists() ? { id: roomSnap.id, ...roomSnap.data() } : null;

      const currentSpaces = Math.max(1, Number.parseInt(String(resData.spaces ?? 1), 10) || 1);
      const requested = kind === 'unreserveAll' ? currentSpaces : (kind === 'unreserveOne' ? 1 : requestedRelease);
      const effectiveRelease = Math.min(currentSpaces, Math.max(1, requested));

      // Compute host payout per space.
      // Prefer stored hostPayout/totalPrice; fallback to unitPrice/duration.
      const storedTotal =
        typeof resData.hostPayout === 'number'
          ? resData.hostPayout
          : (typeof resData.totalPrice === 'number' ? resData.totalPrice : null);
      const unitPrice = typeof resData.unitPrice === 'number' ? resData.unitPrice : 0;
      const duration = typeof resData.duration === 'number' ? resData.duration : 0;
      const computedPerSpace = duration * (unitPrice / 24);
      const perSpacePayout = storedTotal !== null ? (storedTotal / currentSpaces) : computedPerSpace;

      if (effectiveRelease >= currentSpaces) {
        // full cancel
        delta = currentSpaces;
        updatedReservationSpaces = 0;
        earningsDelta = Math.max(0, perSpacePayout * delta);
        transaction.delete(resRef);
      } else {
        delta = effectiveRelease;
        const nextSpaces = currentSpaces - effectiveRelease;
        updatedReservationSpaces = nextSpaces;

        earningsDelta = Math.max(0, perSpacePayout * delta);

        const scale = nextSpaces / currentSpaces;
        const nextTotalPrice = typeof resData.totalPrice === 'number' ? (resData.totalPrice * scale) : undefined;
        const nextTotalPaid = typeof resData.totalPaid === 'number' ? (resData.totalPaid * scale) : undefined;
        const nextServiceFee = typeof resData.serviceFee === 'number' ? (resData.serviceFee * scale) : undefined;
        const nextHostPayout = typeof resData.hostPayout === 'number' ? (resData.hostPayout * scale) : undefined;

        transaction.update(resRef, {
          spaces: nextSpaces,
          ...(nextTotalPrice !== undefined ? { totalPrice: nextTotalPrice } : {}),
          ...(nextTotalPaid !== undefined ? { totalPaid: nextTotalPaid } : {}),
          ...(nextServiceFee !== undefined ? { serviceFee: nextServiceFee } : {}),
          ...(nextHostPayout !== undefined ? { hostPayout: nextHostPayout } : {}),
          updatedAt: serverTimestamp(),
        });
      }

      if (roomRef && roomData) {
        const currentCap = getRoomCapacity(roomData);
        const maxCap = getRoomMaxCapacity(roomData) || (currentCap + delta);
        const nextCap = Math.min(maxCap, currentCap + delta);
        transaction.update(roomRef, { capacity: nextCap, available: true, updatedAt: serverTimestamp() });
      }

      // Adjust host earnings when a reservation is reduced/cancelled.
      if (hostUserRef && Number.isFinite(earningsDelta) && earningsDelta > 0) {
        transaction.update(hostUserRef, {
          totalEarnings: increment(-earningsDelta),
          lastEarningUpdate: serverTimestamp(),
        });
      }
    });

    if (updatedReservationSpaces === 0) {
      setMyReservations((prev) => prev.filter((x) => x.reservationId !== reservationId));
    } else {
      setMyReservations((prev) =>
        prev.map((r) => (r.reservationId === reservationId ? { ...r, spaces: updatedReservationSpaces } : r))
      );
    }

    if (roomId) {
      // only updates if this user owns the room (it will exist in myRooms)
      setMyRooms((prev) =>
        prev.map((r) => {
          if (r.id !== roomId) return r;
          const currentCap = getRoomCapacity(r);
          const maxCap = getRoomMaxCapacity(r) || (currentCap + delta);
          return { ...r, capacity: Math.min(maxCap, currentCap + delta) };
        })
      );
    }

    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: updatedReservationSpaces === 0 ? 'Reservation updated' : `Released ${delta} space${delta !== 1 ? 's' : ''}`,
      },
    });
  };

  const runConfirm = async () => {
    if (!confirmPayload) return;
    const { type, id, extra } = confirmPayload;
    setConfirmOpen(false);
    try {
      if (type === "deleteRoom") {
        await deleteDoc(doc(db, "rooms", id));
        setMyRooms((prev) => prev.filter((r) => r.id !== id));
        dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "success", message: "Room deleted" } });
      } else if (type === "toggleCapacity") {
        // Pause listing (set capacity=0) or restore to maxCapacity
        const roomId = id;
        if (!roomId) throw new Error('Missing room id');
        const roomRef = doc(db, "rooms", roomId);

        let newCapacity = 0;
        let newMaxCapacity = undefined;

        await runTransaction(db, async (transaction) => {
          const snap = await transaction.get(roomRef);
          if (!snap.exists()) throw new Error('Room not found');
          const roomData = { id: snap.id, ...snap.data() };
          const currentCap = getRoomCapacity(roomData);
          const maxCap = getRoomMaxCapacity(roomData) || (currentCap > 0 ? currentCap : 1);

          if (currentCap > 0) {
            newCapacity = 0;
          } else {
            newCapacity = maxCap > 0 ? maxCap : 1;
          }

          // For legacy docs, ensure maxCapacity exists once we touch it
          if (!Number.isFinite(roomData.maxCapacity)) {
            newMaxCapacity = maxCap;
          }

          transaction.update(roomRef, {
            ...(newMaxCapacity !== undefined ? { maxCapacity: newMaxCapacity } : {}),
            capacity: newCapacity,
            available: true,
            updatedAt: serverTimestamp(),
          });
        });

        setMyRooms((prev) =>
          prev.map((r) => {
            if (r.id !== roomId) return r;
            return {
              ...r,
              ...(newMaxCapacity !== undefined ? { maxCapacity: newMaxCapacity } : {}),
              capacity: newCapacity,
            };
          })
        );

        dispatch({
          type: "UPDATE_ALERT",
          payload: {
            open: true,
            severity: "success",
            message: newCapacity > 0 ? "Listing restored" : "Listing paused",
          },
        });
      } else if (type === "unreserveAll" || type === "unreserveOne" || type === "unreserveN") {
        const { reservationId, roomId } = extra || {};
        await unreserveReservation({
          kind: type,
          reservationId,
          roomId,
          count: extra?.count ?? 1,
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "error", message: err.message || "Action failed" } });
    } finally {
      setConfirmPayload(null);
    }
  };

  const openRelease = (res) => {
    setReleaseTarget(res);
    setReleaseCount("1");
    setReleaseOpen(true);
  };

  const closeRelease = () => {
    if (releaseSubmitting) return;
    setReleaseOpen(false);
    setReleaseTarget(null);
    setReleaseCount("1");
  };

  const submitRelease = async () => {
    if (!releaseTarget) return;
    const max = Math.max(1, Number.parseInt(String(releaseTarget?.spaces ?? 1), 10) || 1);
    const requested = Number.parseInt(String(releaseCount ?? "").trim(), 10);

    if (!Number.isFinite(requested) || requested < 1 || requested > max) {
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: `Please enter a number between 1 and ${max}.`,
        },
      });
      return;
    }

    const n = requested;

    setReleaseSubmitting(true);
    try {
      await unreserveReservation({
        kind: 'unreserveN',
        reservationId: releaseTarget.reservationId,
        roomId: releaseTarget.room?.id,
        count: n,
      });
      closeRelease();
    } catch (err) {
      console.error(err);
      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "error", message: err.message || "Action failed" } });
    } finally {
      setReleaseSubmitting(false);
    }
  };

  const openRating = (res) => {
    setRatingRoom(res);
    setSelectedRating(res.userRating || 0);
    setRatingOpen(true);
  };

  const closeRating = () => {
    setRatingOpen(false);
    setRatingRoom(null);
    setSelectedRating(0);
  };

  const submitRating = async () => {
    if (!ratingRoom || !selectedRating) return;
    setRatingSubmitting(true);
    try {
      await runTransaction(db, async (transaction) => {
        const roomRef = doc(db, 'rooms', ratingRoom.room.id);
        const roomSnap = await transaction.get(roomRef);
        if (!roomSnap.exists()) throw new Error('Room not found');

        const roomData = roomSnap.data();
        const currentRatingCount = roomData.ratingCount || 0;
        const currentAverageRating = roomData.averageRating || 0;

        let newRatingCount = currentRatingCount;
        let newAverageRating = currentAverageRating;

        if (ratingRoom.hasRated) {
          // Update existing rating: subtract old, add new
          const oldRating = ratingRoom.userRating;
          newAverageRating = ((currentAverageRating * currentRatingCount) - oldRating + selectedRating) / currentRatingCount;
        } else {
          // New rating
          newRatingCount = currentRatingCount + 1;
          newAverageRating = ((currentAverageRating * currentRatingCount) + selectedRating) / newRatingCount;
        }

        const ratingRef = doc(db, 'rooms', ratingRoom.room.id, 'ratings', currentUser.uid);
        transaction.set(ratingRef, { rating: selectedRating, ratedAt: serverTimestamp() });

        transaction.update(roomRef, {
          ratingCount: newRatingCount,
          averageRating: newAverageRating
        });
      });

      // Update local state
      setMyReservations(prev => prev.map(r => 
        r.reservationId === ratingRoom.reservationId ? { ...r, hasRated: true, userRating: selectedRating } : r
      ));

      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "success", message: "Rating submitted successfully" } });
      closeRating();
    } catch (err) {
      console.error(err);
      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "error", message: err.message || "Failed to submit rating" } });
    } finally {
      setRatingSubmitting(false);
    }
  };

  // UI small components
  const RoomCard = ({ room, compact = false }) => (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardActionArea onClick={() => navigate(`/booking/${room.id}`, { state: { room: room, self: true } })}>
        {room.images?.[0] ? (
          <CardMedia
            component="img"
            height={compact ? 140 : 200}
            image={room.images[0]}
            alt={room.title}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{
            height: compact ? 140 : 200,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Home sx={{ fontSize: 60, color: theme.palette.common.white, opacity: 0.8 }} />
          </Box>
        )}
      </CardActionArea>
      <CardContent sx={{ flex: "1 1 auto", p: 2, display: "flex", flexDirection: "column" }}>
        <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              {(() => {
                const cap = getRoomCapacity(room);
                const isAvail = cap > 0;
                return (
                  <>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                {room.title}
              </Typography>
              <Chip
                label={isAvail ? `Available (${cap})` : "Reserved"}
                color={isAvail ? "success" : "error"}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 22,
                  ...chipSx,
                }}
              />
                  </>
                );
              })()}
            </Box>
            <Typography variant="h6" sx={{
              fontWeight: 800,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <PriceCheck fontSize="small" />${typeof room.price === "number" ? room.price.toFixed(2) : room.price}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            minHeight: '3em'
          }}>
            {room.description}
          </Typography>
        </Stack>

        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ my: 1 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarMonth fontSize="small" /> Last updated {formatRoomDate(room.updatedAt)}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => openEdit(room)}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={getRoomCapacity(room) > 0 ? "Pause Listing" : "Restore Listing"}>
                <IconButton
                  onClick={() => confirmAction({ type: "toggleCapacity", id: room.id })}
                  size="small"
                  sx={{
                    bgcolor: getRoomCapacity(room) > 0 ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                    '&:hover': {
                      bgcolor: getRoomCapacity(room) > 0 ? alpha(theme.palette.warning.main, 0.2) : alpha(theme.palette.success.main, 0.2)
                    }
                  }}
                >
                  {getRoomCapacity(room) > 0 ? <ToggleOff fontSize="small" /> : <ToggleOn fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => confirmAction({ type: "deleteRoom", id: room.id })}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  // skeleton grid while loading - responsive spacing
  const SkeletonGrid = () => (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card>
            <Skeleton variant="rectangular" height={160} />
            <CardContent>
              <Skeleton width="60%" height={32} />
              <Skeleton width="40%" />
              <Skeleton width="80%" />
              <Skeleton width="90%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{
      minHeight: "auto",
      pt: 2,
      pb: 4,
      background: theme.palette.background.default,
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            background: theme.customStyles.heroBackground,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: `radial-gradient(circle, ${alpha(theme.palette.common.white, 0.1)} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              opacity: 0.5
            }
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
            <Stack>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                <DashboardIcon sx={{ fontSize: 32 }} />
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Dashboard</Typography>
              </Stack>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '600px' }}>
                Manage your rooms, track earnings, and handle reservations all in one place
              </Typography>
            </Stack>

            <Stack direction="column" spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: 120,
                    background: alpha(theme.palette.common.white, 0.15),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MonetizationOn sx={{ fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Total Earnings</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ${userStats.totalEarnings}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    minWidth: 120,
                    background: alpha(theme.palette.common.white, 0.15),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PeopleAlt sx={{ fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Active Bookings</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{myReservations.length}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>

              <Button
                variant="contained"
                startIcon={<UploadFile />}
                onClick={() => navigate('/upload')}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  width: '100%',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.9)
                  }
                }}
              >
                Upload New
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
          {/* Left: My Rooms Section */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}>
                  <Home />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    Your Listings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {myRooms.length} room{myRooms.length !== 1 ? 's' : ''} listed • {myRooms.filter((r) => getRoomCapacity(r) > 0).length} available
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {myRoomsLoading ? (
                <SkeletonGrid />
              ) : myRooms.length === 0 ? (
                <Box sx={{
                  py: 8,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.5)
                }}>
                  <MeetingRoom sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                    No rooms listed yet
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary, maxWidth: 400, mx: 'auto' }}>
                    Upload your first room and start earning from rentals
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<UploadFile />}
                    onClick={() => navigate('/upload')}
                    size="large"
                  >
                    Upload First Room
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                  {myRooms.map((r) => (
                    <Grid item xs={12} sm={6} key={r.id}>
                      <RoomCard room={r} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Right: My Reservations Section */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                height: '100%'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main
                }}>
                  <CalendarMonth />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    Your Rentals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {myReservations.length} active booking{myReservations.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {myReservationsLoading ? (
                <Stack spacing={2}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                  ))}
                </Stack>
              ) : myReservations.length === 0 ? (
                <Box sx={{
                  py: 6,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.5)
                }}>
                  <CalendarMonth sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                    No rentals yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300, mx: 'auto' }}>
                    Find amazing rooms and book your next stay
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/rooms')}
                    size="large"
                  >
                    Browse Rooms
                  </Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {myReservations.map((res) => (
                    <Card
                      key={res.reservationId}
                      sx={{
                        transition: 'all 0.2s ease',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <Grid container sx={{ minHeight: { xs: 'auto', sm: 110 } }}>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex' }}>
                          {res.room?.images?.[0] ? (
                            <CardMedia
                              component="img"
                              image={res.room.images[0]}
                              alt={res.room.title}
                              sx={{
                                width: '100%',
                                height: { xs: 140, sm: '100%' },
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <Box sx={{
                              width: '100%',
                              height: { xs: 140, sm: '100%' },
                              bgcolor: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Home sx={{ fontSize: 40, color: theme.palette.common.white, opacity: 0.8 }} />
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={8} sx={{ display: 'flex' }}>
                          <CardContent sx={{ p: 1.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Stack spacing={1}>
                              <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="space-between"
                                alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                                spacing={{ xs: 1, sm: 0 }}
                              >
                                <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                                  <Typography variant="subtitle2" sx={{
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    lineHeight: 1.2
                                  }}>
                                    {res.room?.title || 'Room Unavailable'}
                                  </Typography>
                                  <Stack
                                    direction="row"
                                    spacing={0.5}
                                    useFlexGap
                                    sx={{ flexWrap: 'wrap', rowGap: 0.5, maxWidth: '100%' }}
                                  >
                                    {!!res?.bookingEnd && (
                                      <Chip
                                        label={`Reserved until ${formatBookingDateTime(res.bookingEnd)}`}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        sx={{
                                          height: 20,
                                          fontSize: '0.7rem',
                                          fontWeight: 700,
                                          ...chipSx,
                                        }}
                                      />
                                    )}
                                    <Chip
                                      label={`${Math.max(1, Number.parseInt(String(res.spaces ?? 1), 10) || 1)} space${Math.max(1, Number.parseInt(String(res.spaces ?? 1), 10) || 1) !== 1 ? 's' : ''}`}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        ...chipSx,
                                      }}
                                    />
                                  </Stack>
                                </Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                                  <Chip
                                    label={`$${res.room?.price ?? '—'}`}
                                    size="small"
                                    color="primary"
                                    sx={{
                                      height: 20,
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      ...chipSx,
                                    }}
                                  />
                                </Stack>
                              </Stack>

                              <Typography variant="caption" color="text.secondary" sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.3
                              }}>
                                {res.room?.description || 'No description available'}
                              </Typography>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              useFlexGap
                              sx={{
                                mt: 'auto',
                                pt: 1,
                                flexWrap: 'wrap',
                                rowGap: 1,
                              }}
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate(`/booking/${res.room?.id}`, { state: { room: res.room } })}
                                sx={{
                                  fontSize: '0.75rem',
                                  py: 0.25,
                                  whiteSpace: 'nowrap',
                                  flex: { xs: '1 1 calc(50% - 8px)', sm: '0 0 auto' },
                                }}
                              >
                                Details
                              </Button>

                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => openRelease(res)}
                                sx={{
                                  fontSize: '0.75rem',
                                  py: 0.25,
                                  whiteSpace: 'nowrap',
                                  flex: { xs: '1 1 calc(50% - 8px)', sm: '0 0 auto' },
                                }}
                              >
                                Release
                              </Button>

                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => openRating(res)}
                                sx={{
                                  fontSize: '0.75rem',
                                  py: 0.25,
                                  whiteSpace: 'nowrap',
                                  bgcolor: theme.palette.secondary.main,
                                  '&:hover': { bgcolor: theme.palette.secondary.dark },
                                  flex: { xs: '1 1 100%', sm: '0 0 auto' },
                                }}
                              >
                                {res.hasRated ? `⭐ ${res.userRating}` : "Rate"}
                              </Button>
                            </Stack>
                          </CardContent>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Release spaces dialog */}
      <Dialog
        open={releaseOpen}
        onClose={closeRelease}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Release Spaces</DialogTitle>
        <DialogContent sx={{ pt: 1.5, pb: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {releaseTarget?.room?.title || "Room Unavailable"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {releaseTarget?.room?.fullAddress ||
                [releaseTarget?.room?.address, releaseTarget?.room?.city, releaseTarget?.room?.state, releaseTarget?.room?.zipCode]
                  .filter(Boolean)
                  .join(", ") ||
                ""}
            </Typography>

            <Stack direction="column" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label={`${Math.max(1, Number.parseInt(String(releaseTarget?.spaces ?? 1), 10) || 1)} reserved`}
                sx={chipSx}
              />
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={`$${releaseTarget?.room?.price ?? "—"}`}
                sx={chipSx}
              />
              {(releaseTarget?.bookingStart || releaseTarget?.bookingEnd) && (
                <Tooltip
                  title={`${releaseTarget?.bookingStart ? new Date(releaseTarget.bookingStart).toLocaleString() : "—"} – ${releaseTarget?.bookingEnd ? new Date(releaseTarget.bookingEnd).toLocaleString() : "—"}`}
                  placement="top"
                  arrow
                >
                  <Chip
                    size="small"
                    variant="outlined"
                    sx={{ flexBasis: '100%', maxWidth: '100%' }}
                    label={
                      <Box
                        component="span"
                        sx={{
                          display: 'block',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          py: 0.25
                        }}
                      >
                        {`${formatBookingDateTime(releaseTarget?.bookingStart)} – ${formatBookingDateTime(releaseTarget?.bookingEnd)}`}
                      </Box>
                    }
                  />
                </Tooltip>
              )}
            </Stack>
          </Box>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Choose how many spaces you want to release from this reservation.
          </Typography>

          <TextField
            label="Spaces to release"
            type="number"
            fullWidth
            value={releaseCount}
            onChange={(e) => setReleaseCount(e.target.value)}
            disabled={releaseSubmitting}
            inputProps={{
              min: 1,
              max: Math.max(1, Number.parseInt(String(releaseTarget?.spaces ?? 1), 10) || 1),
              step: 1,
            }}
            error={(() => {
              const max = Math.max(1, Number.parseInt(String(releaseTarget?.spaces ?? 1), 10) || 1);
              const requested = Number.parseInt(String(releaseCount ?? "").trim(), 10);
              if (!String(releaseCount ?? "").trim()) return false;
              return !Number.isFinite(requested) || requested < 1 || requested > max;
            })()}
            helperText={(() => {
              const max = Math.max(1, Number.parseInt(String(releaseTarget?.spaces ?? 1), 10) || 1);
              const requested = Number.parseInt(String(releaseCount ?? "").trim(), 10);
              if (String(releaseCount ?? "").trim() && (!Number.isFinite(requested) || requested < 1 || requested > max)) {
                return `Enter a number between 1 and ${max}.`;
              }
              return `You have ${max} space${max !== 1 ? 's' : ''} reserved. Releasing all cancels the reservation.`;
            })()}
          />
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            pt: 0,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            '& > :not(style) ~ :not(style)': {
              ml: { xs: 0, sm: 1 },
              mt: { xs: 1, sm: 0 },
            },
          }}
        >
          <Button onClick={closeRelease} variant="outlined" disabled={releaseSubmitting} fullWidth={isMobile}>Cancel</Button>
          <Button
            onClick={submitRelease}
            variant="contained"
            color="error"
            disabled={releaseSubmitting || (() => {
              const max = Math.max(1, Number.parseInt(String(releaseTarget?.spaces ?? 1), 10) || 1);
              const requested = Number.parseInt(String(releaseCount ?? "").trim(), 10);
              return !Number.isFinite(requested) || requested < 1 || requested > max;
            })()}
            startIcon={releaseSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
            fullWidth={isMobile}
          >
            {releaseSubmitting ? 'Releasing…' : 'Release'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={editOpen}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2 } }}
      >
        <DialogTitle sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          fontWeight: 700
        }}>
          Edit Room Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2, pb: 1 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={editValues.title || ''}
              onChange={(e) => setEditValues((s) => ({ ...s, title: e.target.value }))}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Price ($)"
              fullWidth
              value={editValues.price || ''}
              onChange={(e) => setEditValues((s) => ({ ...s, price: e.target.value }))}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <Typography color="text.secondary">$</Typography>
              }}
            />

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  label="Total Spaces (Max)"
                  fullWidth
                  type="number"
                  value={editValues.maxCapacity || ''}
                  onChange={(e) => setEditValues((s) => ({ ...s, maxCapacity: e.target.value }))}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 1, max: MAX_LISTING_CAPACITY, step: 1 }}
                  helperText={`Total capacity for this listing (1-${MAX_LISTING_CAPACITY})`}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  label="Spaces Available Now"
                  fullWidth
                  type="number"
                  value={editValues.capacity || ''}
                  onChange={(e) => setEditValues((s) => ({ ...s, capacity: e.target.value }))}
                  variant="outlined"
                  size="small"
                  inputProps={{
                    min: 0,
                    max: Math.min(
                      MAX_LISTING_CAPACITY,
                      Math.max(1, Number.parseInt(String(editValues.maxCapacity ?? MAX_LISTING_CAPACITY), 10) || MAX_LISTING_CAPACITY)
                    ),
                    step: 1,
                  }}
                  helperText="Current remaining spaces (0 = reserved)"
                />
              </Box>
            </Box>

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editValues.description || ''}
              onChange={(e) => setEditValues((s) => ({ ...s, description: e.target.value }))}
              variant="outlined"
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            pt: 0,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            '& > :not(style) ~ :not(style)': {
              ml: { xs: 0, sm: 1 },
              mt: { xs: 1, sm: 0 },
            },
          }}
        >
          <Button onClick={closeEdit} variant="outlined" fullWidth={isMobile}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" fullWidth={isMobile} sx={{ ml: { sm: 1 } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            {confirmPayload?.type === 'deleteRoom'
              ? 'Are you sure you want to delete this room? This action cannot be undone.'
              : confirmPayload?.type === 'toggleCapacity'
                ? 'Do you want to pause/restore this listing? (Pausing sets capacity to 0.)'
                : 'Are you sure you want to update this reservation?'}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            pt: 0,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            '& > :not(style) ~ :not(style)': {
              ml: { xs: 0, sm: 1 },
              mt: { xs: 1, sm: 0 },
            },
          }}
        >
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" fullWidth={isMobile}>
            No, Keep
          </Button>
          <Button onClick={runConfirm} variant="contained" fullWidth={isMobile} color={confirmPayload?.type === 'deleteRoom' ? 'error' : 'primary'}>
            Yes, Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating dialog */}
      <Dialog
        open={ratingOpen}
        onClose={closeRating}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2 } }}
      >
        <DialogTitle sx={{
          bgcolor: theme.palette.secondary.main,
          color: 'white',
          fontWeight: 700
        }}>
          Rate Your Experience
        </DialogTitle>
        <DialogContent sx={{ mt: 2, pb: 1 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {ratingRoom?.room?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ratingRoom?.room?.description}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                How would you rate this parking space?
              </Typography>
              <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    sx={{
                      color: star <= selectedRating ? theme.palette.warning.main : theme.palette.grey[300],
                      '&:hover': { color: theme.palette.warning.main }
                    }}
                  >
                    <StarIcon fontSize="large" />
                  </IconButton>
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                {selectedRating > 0 ? `${selectedRating} star${selectedRating > 1 ? 's' : ''}` : 'Select a rating'}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            pt: 0,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1,
            '& > :not(style) ~ :not(style)': {
              ml: { xs: 0, sm: 1 },
              mt: { xs: 1, sm: 0 },
            },
          }}
        >
          <Button onClick={closeRating} variant="outlined" fullWidth={isMobile}>
            Cancel
          </Button>
          <Button 
            onClick={submitRating} 
            variant="contained" 
            disabled={!selectedRating || ratingSubmitting}
            fullWidth={isMobile}
            sx={{ 
              ml: { sm: 1 },
              bgcolor: theme.palette.secondary.main,
              '&:hover': { bgcolor: theme.palette.secondary.dark }
            }}
          >
            {ratingSubmitting ? (
              <>
                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                Rate
              </>
            ) : (
              'Rate'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}