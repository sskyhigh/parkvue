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
  Skeleton,
  Divider,
  useTheme,
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
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

// UserDashboard component
export default function UserDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { dispatch } = useValue();
  const { currentUser } = useContext(Context) || {};
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

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
        data.sort((a, b) => (a.available === b.available ? 0 : a.available ? -1 : 1));
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

  // Handlers: Edit, Save, Delete, Toggle availability, Unreserve
  const openEdit = (room) => {
    setEditingRoom(room);
    setEditValues({ title: room.title || "", price: room.price || "", description: room.description || "" });
    setEditOpen(true);
  };
  const closeEdit = () => { setEditOpen(false); setEditingRoom(null); setEditValues({}); };

  const handleEditSave = async () => {
    if (!editingRoom) return;
    try {
      const roomRef = doc(db, "rooms", editingRoom.id);
      await updateDoc(roomRef, { ...editValues, updatedAt: serverTimestamp() });
      // refresh
      setMyRooms((prev) => prev.map((r) => (r.id === editingRoom.id ? { ...r, ...editValues } : r)));
      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "success", message: "Room updated" } });
      closeEdit();
    } catch (err) {
      console.error(err);
      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "error", message: err.message || "Update failed" } });
    }
  };

  const confirmAction = (payload) => { setConfirmPayload(payload); setConfirmOpen(true); };
  const runConfirm = async () => {
    if (!confirmPayload) return;
    const { type, id, extra } = confirmPayload;
    setConfirmOpen(false);
    try {
      if (type === "deleteRoom") {
        await deleteDoc(doc(db, "rooms", id));
        setMyRooms((prev) => prev.filter((r) => r.id !== id));
        dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "success", message: "Room deleted" } });
      } else if (type === "toggleAvail") {
        await updateDoc(doc(db, "rooms", id), { available: extra.newVal, updatedAt: serverTimestamp() });
        setMyRooms((prev) => prev.map((r) => (r.id === id ? { ...r, available: extra.newVal } : r)));
        dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "success", message: `Room marked ${extra.newVal ? "available" : "reserved"}` } });
      } else if (type === "unreserve") {
        // confirmPayload.extra should contain reservationId and roomId
        const { reservationId, roomId } = extra;
        if (reservationId) await deleteDoc(doc(db, "reservations", reservationId));
        if (roomId) await updateDoc(doc(db, "rooms", roomId), { available: true, updatedAt: serverTimestamp() });
        // refresh lists locally
        setMyReservations((prev) => prev.filter((x) => x.reservationId !== reservationId));
        setMyRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, available: true } : r)));
        dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "success", message: "Reservation cancelled" } });
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: "UPDATE_ALERT", payload: { open: true, severity: "error", message: err.message || "Action failed" } });
    } finally {
      setConfirmPayload(null);
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
      <CardContent sx={{ flex: "1 1 auto", p: 2 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                {room.title}
              </Typography>
              <Chip
                label={room.available ? "Available" : "Reserved"}
                color={room.available ? "success" : "error"}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 22
                }}
              />
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

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarMonth fontSize="small" /> Last updated {room.updatedAt?.toDate ? room.updatedAt.toDate().toLocaleDateString() : 'N/A'}
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
              <Tooltip title={room.available ? "Mark Reserved" : "Mark Available"}>
                <IconButton
                  onClick={() => confirmAction({ type: "toggleAvail", id: room.id, extra: { newVal: !room.available } })}
                  size="small"
                  sx={{
                    bgcolor: room.available ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                    '&:hover': {
                      bgcolor: room.available ? alpha(theme.palette.warning.main, 0.2) : alpha(theme.palette.success.main, 0.2)
                    }
                  }}
                >
                  {room.available ? <ToggleOff fontSize="small" /> : <ToggleOn fontSize="small" />}
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
        </Stack>
      </CardContent>
    </Card>
  );

  // skeleton grid while loading
  const SkeletonGrid = () => (
    <Grid container spacing={2}>
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
        <Grid container spacing={4}>
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
                    {myRooms.length} room{myRooms.length !== 1 ? 's' : ''} listed • {myRooms.filter(r => r.available).length} available
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
                <Grid container spacing={2}>
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
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <Grid container>
                        <Grid item xs={4}>
                          {res.room?.images?.[0] ? (
                            <CardMedia
                              component="img"
                              image={res.room.images[0]}
                              alt={res.room.title}
                              sx={{
                                height: 100,
                                objectFit: 'cover',
                                borderTopLeftRadius: '4px',
                                borderBottomLeftRadius: '4px'
                              }}
                            />
                          ) : (
                            <Box sx={{
                              height: 100,
                              bgcolor: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Home sx={{ fontSize: 40, color: theme.palette.common.white, opacity: 0.8 }} />
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={8}>
                          <CardContent sx={{ p: 1.5 }}>
                            <Stack spacing={1}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Typography variant="subtitle2" sx={{
                                  fontWeight: 700,
                                  color: theme.palette.text.primary,
                                  lineHeight: 1.2
                                }}>
                                  {res.room?.title || 'Room Unavailable'}
                                </Typography>
                                <Chip
                                  label={`$${res.room?.price ?? '—'}`}
                                  size="small"
                                  color="primary"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 700
                                  }}
                                />
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

                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => navigate(`/booking/${res.room?.id}`, { state: { room: res.room } })}
                                  sx={{
                                    fontSize: '0.75rem',
                                    py: 0.25
                                  }}
                                >
                                  View Details
                                </Button>
                                <Tooltip title={"Cancel This Reservation"}>
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() => confirmAction({ type: 'unreserve', extra: { reservationId: res.reservationId, roomId: res.room?.id } })}
                                    sx={{
                                      fontSize: '0.75rem',
                                      py: 0.25
                                    }}
                                  >
                                    Release
                                  </Button>
                                </Tooltip>
                                <Tooltip title={res.hasRated ? "Change Rating" : ""}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => openRating(res)}
                                    sx={{
                                      fontSize: '0.75rem',
                                      py: 0.25,
                                      bgcolor: theme.palette.secondary.main,
                                      '&:hover': { bgcolor: theme.palette.secondary.dark }
                                    }}
                                  >
                                    {res.hasRated ? `⭐ ${res.userRating}` : "Rate"}
                                  </Button>
                                </Tooltip>
                              </Stack>
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

      {/* Edit dialog */}
      <Dialog open={editOpen} onClose={closeEdit} fullWidth maxWidth="sm" sx={{ zIndex: 900 }}>
        <DialogTitle sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          fontWeight: 700
        }}>
          Edit Room Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
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
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={closeEdit} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" sx={{ ml: 1 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" sx={{ zIndex: 900 }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            {confirmPayload?.type === 'deleteRoom'
              ? 'Are you sure you want to delete this room? This action cannot be undone.'
              : confirmPayload?.type === 'toggleAvail'
                ? 'Do you want to change the availability status of this room?'
                : 'Are you sure you want to cancel this reservation?'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">
            No, Keep
          </Button>
          <Button onClick={runConfirm} variant="contained" color={confirmPayload?.type === 'deleteRoom' ? 'error' : 'primary'}>
            Yes, Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating dialog */}
      <Dialog open={ratingOpen} onClose={closeRating} maxWidth="sm" sx={{ zIndex: 900 }}>
        <DialogTitle sx={{
          bgcolor: theme.palette.secondary.main,
          color: 'white',
          fontWeight: 700
        }}>
          Rate Your Experience
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
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
              <Stack direction="row" spacing={1} justifyContent="center">
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
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={closeRating} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={submitRating} 
            variant="contained" 
            disabled={!selectedRating || ratingSubmitting}
            loading={ratingSubmitting}
            sx={{ 
              ml: 1,
              bgcolor: theme.palette.secondary.main,
              '&:hover': { bgcolor: theme.palette.secondary.dark }
            }}
          >
            Rate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}