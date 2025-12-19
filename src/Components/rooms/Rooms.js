import React, { useEffect, useMemo, useState, useContext } from "react";
import { collection, getDocs, db, doc, getDoc, updateDoc, setDoc, increment, serverTimestamp, query as firebaseQuery, where } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Pagination,
  Stack,
  TextField,
  Typography,
  useTheme,
  Chip,
  CircularProgress,
  Paper,
  Avatar,
  Container,
  alpha,
  Divider,
  Fade,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarToday as CalendarTodayIcon,
  Place as PlaceIcon,
  Star as StarIcon,
  SearchOff,
  Search as SearchIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  LocalParking as ParkingIcon,
  DirectionsCar as CarIcon,
  Home as HomeIcon,
  CheckCircle,
  Warning,
  Info,
  FilterList as FilterIcon,
  ExpandMore,
  ExpandLess,
  RestartAlt,
  Chat as ChatIcon,
  ArrowBackIos,
  ArrowForwardIos,
  PlayCircle,
} from "@mui/icons-material";
import { Context } from "../../context/ContextProvider";

const ROOMS_PER_PAGE = 12;

const Rooms = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, dispatch } = useContext(Context);

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Derive media list
  const mediaList = useMemo(() => {
    if (!selectedRoom) return [];
    const list = [];
    if (selectedRoom.video) list.push({ type: 'video', src: selectedRoom.video });
    if (selectedRoom.images && Array.isArray(selectedRoom.images)) {
      selectedRoom.images.forEach(img => list.push({ type: 'image', src: img }));
    }
    // Fallback if empty
    if (list.length === 0) list.push({ type: 'image', src: "/placeholder-park.jpg" });
    return list;
  }, [selectedRoom]);

  useEffect(() => {
    setPhotoIndex(0);
  }, [selectedRoom]);

  const handleNextMedia = () => {
    setPhotoIndex((prev) => (prev + 1) % mediaList.length);
  };

  const handlePrevMedia = () => {
    setPhotoIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'available', 'reserved'
  const [showFilters, setShowFilters] = useState(false);
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterAmenity, setFilterAmenity] = useState("");
  const [filterSecurity, setFilterSecurity] = useState("");
  const [filterCity, setFilterCity] = useState("");

  // Filter options
  const vehicleTypeOptions = [
    "Car", "SUV", "Truck", "Motorcycle", "Van", "Electric Vehicle", "Compact Car", "Sedan"
  ];

  const amenityOptions = [
    "Covered", "24/7 Access", "Security Camera", "Lighted", "Gated", "EV Charging",
    "Handicap Accessible", "Near Elevator", "Valet Available", "Monthly Discount"
  ];

  const securityFeatureOptions = [
    "Security Cameras", "Lighting", "Gated Entry", "Attendant On-site", "Alarm System", "Security Patrol"
  ];

  const uniqueCities = useMemo(() => {
    const cities = rooms.map(r => r.city).filter(Boolean);
    return [...new Set(cities)].sort();
  }, [rooms]);

  // Fetch rooms
  useEffect(() => {
    let mounted = true;
    const fetchRooms = async () => {
      try {
        const roomCollection = collection(db, "rooms");
        const roomSnapshot = await getDocs(roomCollection);
        const roomData = roomSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch photoURLs for each room's owner
        const roomsWithPhotos = await Promise.all(roomData.map(async (room) => {
          if (room.createdBy) {
            try {
              const userQuery = firebaseQuery(collection(db, 'users'), where('uid', '==', room.createdBy));
              const userSnapshot = await getDocs(userQuery);
              if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                return { ...room, photoURL: userData.photoURL || null };
              }
            } catch (error) {
              console.error('Error fetching photo for room:', room.id, error);
            }
          }
          return room;
        }));

        if (mounted) setRooms(roomsWithPhotos);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };
    fetchRooms();
    return () => {
      mounted = false;
    };
  }, []);

  // helpers
  const incrementView = async (roomId) => {
    if (!currentUser?.uid) return;
    try {
      const viewRef = doc(db, 'rooms', roomId, 'views', currentUser.uid);
      const viewSnap = await getDoc(viewRef);
      if (!viewSnap.exists()) {
        await setDoc(viewRef, { viewedAt: serverTimestamp() });
        const roomRef = doc(db, 'rooms', roomId);
        await updateDoc(roomRef, { viewCount: increment(1) });
      }
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  const handleOpenDialog = (room) => {
    setSelectedRoom(room);
    setOpenDialog(true);
    incrementView(room.id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };

  const handleViewOnMap = () => {
    navigate("/map", { state: { room: selectedRoom } });
  };

  const handleBookClick = () => {
    if (selectedRoom) {
      navigate(`/booking/${selectedRoom.id}`, {
        state: {
          room: selectedRoom,
          self: selectedRoom.ownerEmail === currentUser.email ? true : false
        }
      });
    }
  };

  // search filter function
  const matchesQuery = (room, q) => {
    if (!q) return true;
    const s = q.trim().toLowerCase();
    // fields to search
    const fields = [
      room.title,
      room.address,
      room.city,
      room.state,
      room.zipCode,
      room.fullAddress,
      room.description,
      room.ownerName,
      room.ownerEmail,
    ]
      .concat(room.vehicleTypes || [])
      .concat(room.amenities || []);
    return fields.some((f) => {
      if (!f) return false;
      return String(f).toLowerCase().includes(s);
    });
  };

  // derived: filtered + ordered (available first) list
  const filteredOrdered = useMemo(() => {
    let filtered = rooms.filter((r) => matchesQuery(r, query));

    // Apply filters
    if (filterStatus === 'available') {
      filtered = filtered.filter(r => r.available !== false);
    } else if (filterStatus === 'reserved') {
      filtered = filtered.filter(r => r.available === false);
    }

    if (filterVehicle) {
      filtered = filtered.filter(r => r.vehicleTypes && r.vehicleTypes.includes(filterVehicle));
    }

    if (filterAmenity) {
      filtered = filtered.filter(r => r.amenities && r.amenities.includes(filterAmenity));
    }

    if (filterSecurity) {
      filtered = filtered.filter(r => r.securityFeatures && r.securityFeatures.includes(filterSecurity));
    }

    if (filterCity) {
      filtered = filtered.filter(r => r.city === filterCity);
    }

    // stable partition: available first, reserved last
    const available = filtered.filter((r) => r.available !== false);
    const reserved = filtered.filter((r) => r.available === false);
    return [...available, ...reserved];
  }, [rooms, query, filterStatus, filterVehicle, filterAmenity, filterSecurity, filterCity]);

  // counts for badges (ignoring status filter)
  const counts = useMemo(() => {
    let filtered = rooms.filter(r => matchesQuery(r, query));

    if (filterVehicle) filtered = filtered.filter(r => r.vehicleTypes && r.vehicleTypes.includes(filterVehicle));
    if (filterAmenity) filtered = filtered.filter(r => r.amenities && r.amenities.includes(filterAmenity));
    if (filterSecurity) filtered = filtered.filter(r => r.securityFeatures && r.securityFeatures.includes(filterSecurity));
    if (filterCity) filtered = filtered.filter(r => r.city === filterCity);

    return {
      total: filtered.length,
      available: filtered.filter(r => r.available !== false).length,
      reserved: filtered.filter(r => r.available === false).length
    };
  }, [rooms, query, filterVehicle, filterAmenity, filterSecurity, filterCity]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(filteredOrdered.length / ROOMS_PER_PAGE));
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount]); // reset page if pageCount changes

  const displayed = useMemo(() => {
    const start = (page - 1) * ROOMS_PER_PAGE;
    return filteredOrdered.slice(start, start + ROOMS_PER_PAGE);
  }, [filteredOrdered, page]);

  // small helper for nice date
  const prettyDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  // Animation keyframes
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

  return (
    <Box
      sx={{
        minHeight: "auto",
        pt: 2,
        pb: 3,
        background: theme.palette.customStyles?.heroBackground || theme.palette.background.default,
        ...fadeIn,
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <HomeIcon />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                }}
              >
                Discover Parking Spaces
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Find and book the perfect parking spot
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            animation: "fadeIn 0.6s ease-out",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={2}>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
                Search Parking Spaces
              </Typography>
              <TextField
                size="medium"
                fullWidth
                placeholder="Search by title, address, city, amenities, owner..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, md: 3 } }}>
              <Button
                variant={showFilters ? "contained" : "outlined"}
                startIcon={showFilters ? <ExpandLess /> : <FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ whiteSpace: "nowrap", borderRadius: 2 }}
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<SearchOff />}
                onClick={() => {
                  setQuery("");
                  setFilterStatus("all");
                  setFilterVehicle("");
                  setFilterAmenity("");
                  setFilterSecurity("");
                  setFilterCity("");
                  setPage(1);
                }}
                sx={{ whiteSpace: "nowrap", borderRadius: 2 }}
              >
                Clear
              </Button>
            </Stack>
          </Stack>

          <Collapse in={showFilters}>
            <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Filter Options</Typography>
                <Button
                  size="small"
                  startIcon={<RestartAlt />}
                  onClick={() => {
                    setFilterVehicle("");
                    setFilterAmenity("");
                    setFilterSecurity("");
                    setFilterCity("");
                  }}
                >
                  Reset Filters
                </Button>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                      value={filterVehicle}
                      label="Vehicle Type"
                      onChange={(e) => setFilterVehicle(e.target.value)}
                    >
                      <MenuItem value=""><em>All Types</em></MenuItem>
                      {vehicleTypeOptions.map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Amenity</InputLabel>
                    <Select
                      value={filterAmenity}
                      label="Amenity"
                      onChange={(e) => setFilterAmenity(e.target.value)}
                    >
                      <MenuItem value=""><em>All Amenities</em></MenuItem>
                      {amenityOptions.map((a) => (
                        <MenuItem key={a} value={a}>{a}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Security</InputLabel>
                    <Select
                      value={filterSecurity}
                      label="Security"
                      onChange={(e) => setFilterSecurity(e.target.value)}
                    >
                      <MenuItem value=""><em>All Features</em></MenuItem>
                      {securityFeatureOptions.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>City</InputLabel>
                    <Select
                      value={filterCity}
                      label="City"
                      onChange={(e) => setFilterCity(e.target.value)}
                    >
                      <MenuItem value=""><em>All Cities</em></MenuItem>
                      {uniqueCities.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          {/* Stats Row */}
          <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
            <Chip
              icon={<CheckCircle sx={{ fontSize: 16 }} />}
              label={`${counts.available} Available`}
              color="success"
              variant={filterStatus === 'available' ? "filled" : "outlined"}
              onClick={() => setFilterStatus(filterStatus === 'available' ? 'all' : 'available')}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              icon={<Warning sx={{ fontSize: 16 }} />}
              label={`${counts.reserved} Reserved`}
              color="default"
              variant={filterStatus === 'reserved' ? "filled" : "outlined"}
              onClick={() => setFilterStatus(filterStatus === 'reserved' ? 'all' : 'reserved')}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              icon={<Info sx={{ fontSize: 16 }} />}
              label={`${counts.total} Total Spaces`}
              color="primary"
              variant={filterStatus === 'all' ? "filled" : "outlined"}
              onClick={() => setFilterStatus('all')}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Paper>

        {/* Rooms Grid */}
        {loading ? (
          <Box
            sx={{
              py: 10,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mt: 2, fontWeight: 500 }}
            >
              Loading available spaces…
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fetching the best parking spots for you
            </Typography>
          </Box>
        ) : (
          <Box>
            <Grid container spacing={3}>
              {displayed.map((room, index) => {
                const isAvailable = room.available !== false;
                const img = room.images && room.images.length ? room.images[0] : "";
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
                    <Fade in timeout={300}>
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 4,
                          bgcolor: "background.paper",
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: `0 4px 20px -10px ${alpha(theme.palette.text.primary, 0.1)}`,
                          animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: `0 20px 40px -15px ${alpha(theme.palette.primary.main, 0.2)}`,
                            '& .room-image': {
                              transform: 'scale(1.05)',
                            }
                          }
                        }}
                      >
                        {/* Status Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            zIndex: 2,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 100,
                            bgcolor: isAvailable ? alpha(theme.palette.success.main, 0.9) : alpha(theme.palette.error.main, 0.9),
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {isAvailable ? <CheckCircle sx={{ fontSize: 14 }} /> : <Warning sx={{ fontSize: 14 }} />}
                          {isAvailable ? "AVAILABLE" : "RESERVED"}
                        </Box>

                        {/* Price Tag */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 2,
                          }}
                        >
                          <Box sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.95),
                            color: theme.palette.text.primary,
                            px: 2,
                            py: 0.4,
                            borderRadius: 50,
                            fontWeight: 800,
                            fontSize: "1rem",
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 0.5
                          }}>
                            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>$</Typography>
                            {Number(room.price || 0).toFixed(0)}
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: theme.palette.text.secondary, ml: 0.5 }}>/day</Typography>
                          </Box>
                        </Box>

                        <CardActionArea
                          onClick={() => handleOpenDialog(room)}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            flex: 1
                          }}
                        >
                          {/* Image Container with Fixed Aspect Ratio */}
                          <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
                            <CardMedia
                              component="img"
                              className="room-image"
                              image={img || "/placeholder-park.jpg"}
                              alt={room.title}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: "cover",
                                transition: "transform 0.6s ease",
                                filter: !isAvailable ? 'grayscale(0.8)' : 'none',
                              }}
                            />
                            {/* Gradient Overlay */}
                            <Box sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: '40%',
                              background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                              pointerEvents: 'none',
                            }} />
                          </Box>

                          <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ mb: 2 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    color: theme.palette.text.primary,
                                    lineHeight: 1.3,
                                    height: '2.6em', // Fixed height for 2 lines
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {room.title || "Untitled Space"}
                                </Typography>
                              </Stack>

                              <Stack direction="row" spacing={1} alignItems="center">
                                <PlaceIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  noWrap
                                  sx={{ fontWeight: 500 }}
                                >
                                  {room.city ? `${room.city}, ${room.state || ""}` : "Location hidden"}
                                </Typography>
                              </Stack>
                            </Box>

                            <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <SpeedIcon sx={{ fontSize: 14 }} />
                                {room.viewCount ? (room.viewCount >= 1000 ? `${(room.viewCount / 1000).toFixed(1)}K` : room.viewCount) : 0} views
                              </Typography>
                              {room.ratingCount > 0 ? (
                                <Chip
                                  size="small"
                                  icon={<StarIcon sx={{ fontSize: '14px !important', color: theme.palette.warning.main }} />}
                                  label={`${room.averageRating.toFixed(1)} (${room.ratingCount})`}
                                  sx={{
                                    height: 24,
                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                    color: theme.palette.warning.dark,
                                    fontWeight: 700,
                                    border: 'none'
                                  }}
                                />
                              ) : (
                                <Chip
                                  size="small"
                                  label="Not rated yet"
                                  sx={{
                                    height: 24,
                                    bgcolor: alpha(theme.palette.grey[300], 0.1),
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500,
                                    border: 'none'
                                  }}
                                />
                              )}
                            </Stack>
                            <Box sx={{ height: 24, mb: 0 }}>
                              <Stack direction="row" spacing={1}>
                                {(room.vehicleTypes || []).slice(0, 2).map((v, i) => (
                                  <Typography
                                    key={i}
                                    variant="caption"
                                    sx={{
                                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                                      color: theme.palette.primary.main,
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      fontWeight: 600,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.5
                                    }}
                                  >
                                    <CarIcon sx={{ fontSize: 12 }} /> {v}
                                  </Typography>
                                ))}
                                {(room.vehicleTypes || []).length > 2 && (
                                  <Typography variant="caption" color="text.secondary" sx={{ py: 0.5 }}>
                                    +{room.vehicleTypes.length - 2} more
                                  </Typography>
                                )}
                              </Stack>
                            </Box>

                            {/* Date Availability */}
                            {room.availableFrom && (
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                                <CalendarTodayIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                  {prettyDate(room.availableFrom)} — {prettyDate(room.availableTo)}
                                </Typography>
                              </Stack>
                            )}
                          </CardContent>
                        </CardActionArea>

                        {/* Card Actions */}
                        <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                          <Button
                            fullWidth
                            variant="contained"
                            disableElevation
                            disabled={!isAvailable}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/booking/${room.id}`, { state: { room } });
                            }}
                            sx={{
                              borderRadius: 3,
                              py: 1.2,
                              fontSize: '0.9rem',
                              textTransform: 'none',
                              fontWeight: 600,
                              background: isAvailable
                                ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                                : theme.palette.action.disabledBackground,
                              boxShadow: isAvailable ? `0 8px 16px -4px ${alpha(theme.palette.primary.main, 0.3)}` : 'none',
                              '&:hover': {
                                boxShadow: isAvailable ? `0 12px 20px -4px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',
                              }
                            }}
                          >
                            {isAvailable ? "Book Space" : "Currently Unavailable"}
                          </Button>
                        </Box>
                      </Card>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>

            {/* No Results */}
            {displayed.length === 0 && (
              <Paper
                sx={{
                  py: 8,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  animation: "fadeIn 0.6s ease-out",
                }}
              >
                <SearchIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 2 }} />
                <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
                  No parking spaces found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                  Try adjusting your search or filters to find what you're looking for.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                >
                  Clear Search
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center", animation: "fadeIn 0.6s ease-out" }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, v) => setPage(v)}
              color="primary"
              shape="rounded"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  fontWeight: 600,
                }
              }}
            />
          </Box>
        )}
      </Container>

      {/* Enhanced Quick-view Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            ...pulse,
            animation: "fadeIn 0.3s ease-out, pulse 2s infinite 2s",
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            pb: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <ParkingIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                {selectedRoom?.title || "Parking Space Details"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete information and booking options
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.2),
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {selectedRoom && (
          <DialogContent dividers sx={{ p: 0 }}>
            <Grid container>
              {/* Images Column */}
              {/* Images Column with Slider */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, height: '100%' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: "100%",
                      height: 300,
                      bgcolor: '#000',
                      borderRadius: 2,
                      overflow: 'hidden',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Media Display */}
                    {mediaList[photoIndex]?.type === 'video' ? (
                      <CardMedia
                        component="video"
                        controls
                        src={mediaList[photoIndex].src}
                        sx={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <CardMedia
                        component="img"
                        src={mediaList[photoIndex]?.src}
                        alt={selectedRoom.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}

                    {/* Navigation Buttons */}
                    {mediaList.length > 1 && (
                      <>
                        <IconButton
                          onClick={handlePrevMedia}
                          sx={{
                            position: 'absolute',
                            left: 8,
                            bgcolor: alpha(theme.palette.common.black, 0.5),
                            color: 'white',
                            '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.7) }
                          }}
                        >
                          <ArrowBackIos fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={handleNextMedia}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            bgcolor: alpha(theme.palette.common.black, 0.5),
                            color: 'white',
                            '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.7) }
                          }}
                        >
                          <ArrowForwardIos fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </Box>

                  {/* Thumbnails */}
                  <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                    {mediaList.map((item, i) => (
                      <Box
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        sx={{
                          position: 'relative',
                          width: 80,
                          height: 60,
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          opacity: i === photoIndex ? 1 : 0.6,
                          border: i === photoIndex ? `2px solid ${theme.palette.primary.main}` : 'none',
                          transition: "all 0.2s",
                          flexShrink: 0,
                        }}
                      >
                        {item.type === 'video' ? (
                          <Box sx={{ width: '100%', height: '100%', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PlayCircle sx={{ color: 'white' }} />
                          </Box>
                        ) : (
                          <Box
                            component="img"
                            src={item.src}
                            alt={`thumb-${i}`}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* Details Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* Price and Status */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                          ${Number(selectedRoom.price || 0).toFixed(2)}
                        </Typography>
                        <Chip
                          label={selectedRoom.available ? "Available" : "Reserved"}
                          color={selectedRoom.available ? "success" : "error"}
                          icon={selectedRoom.available ? <CheckCircle /> : <Warning />}
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        {selectedRoom.description}
                      </Typography>
                    </Box>

                    <Divider />

                    {/* Key Details */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                        Key Details
                      </Typography>
                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                            <PlaceIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                              Location:
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ flex: 2 }}>
                            {selectedRoom.fullAddress || `${selectedRoom.address || ""} ${selectedRoom.city || ""}, ${selectedRoom.state || ""}`}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                            <SecurityIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                              Security:
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ flex: 2 }}>
                            {(selectedRoom.securityFeatures || []).join(", ") || "Standard"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                            <SpeedIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                              Access Hours:
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ flex: 2 }}>
                            {selectedRoom.accessHours || "24/7"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                            <CarIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                              Vehicle Types:
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ flex: 2 }}>
                            {(selectedRoom.vehicleTypes || []).join(", ") || "All vehicles"}
                          </Typography>
                        </Stack>

                        {selectedRoom.availableFrom && selectedRoom.availableTo && (
                          <Stack direction="row" spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                              <CalendarTodayIcon color="primary" sx={{ fontSize: 20 }} />
                              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                                Availability:
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ flex: 2 }}>
                              {new Date(selectedRoom.availableFrom).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })} - {new Date(selectedRoom.availableTo).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Amenities */}
                    {(selectedRoom.amenities || []).length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
                          Amenities
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {(selectedRoom.amenities || []).map((amenity, index) => (
                            <Chip
                              key={index}
                              label={amenity}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* Owner Info */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={selectedRoom.photoURL} sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Hosted by {selectedRoom.ownerName || "Anonymous"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Listed on {prettyDate(selectedRoom.createdAt)}
                          </Typography>
                        </Box>
                        {currentUser?.uid !== selectedRoom?.createdBy && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<ChatIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!currentUser) return navigate('/login');
                              setOpenDialog(false);
                              dispatch({
                                type: 'UPDATE_CHAT',
                                payload: {
                                  open: true,
                                  user: {
                                    uid: selectedRoom.createdBy,
                                    name: selectedRoom.ownerName,
                                    photoURL: selectedRoom.photoURL || "/dev.png"
                                  }
                                }
                              });
                            }}
                            sx={{ ml: 'auto', borderRadius: 2 }}
                          >
                            Chat
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        )}

        <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Button
            onClick={handleViewOnMap}
            variant="outlined"
            startIcon={<PlaceIcon />}
            sx={{ borderRadius: 2 }}>
            View on Map
          </Button>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleBookClick}
            disabled={!selectedRoom?.available}
            sx={{ borderRadius: 2, px: 4 }}
            startIcon={<CheckCircle />}
          >
            Book This Space
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Missing icon import
const PersonIcon = ({ sx }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" sx={sx}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export default Rooms;