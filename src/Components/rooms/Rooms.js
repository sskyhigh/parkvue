import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { collection, getDocs, db, doc, getDoc, updateDoc, setDoc, increment, serverTimestamp, query as firebaseQuery, where } from "../../firebase/config";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { documentId, getCountFromServer, limit, orderBy } from "firebase/firestore";
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
  Skeleton,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
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
  Garage as GarageIcon,
  DirectionsCar as CarIcon,
  Home as HomeIcon,
  CheckCircle,
  Warning,
  Info,
  FilterList as FilterIcon,
  ExpandLess,
  RestartAlt,
  Chat as ChatIcon,
  ArrowBackIos,
  ArrowForwardIos,
  PlayCircle,
} from "@mui/icons-material";
import { Context } from "../../context/ContextProvider";
import { getRoomCapacity, isCommercialListing, isRoomAvailable } from "../../utils/capacity";

const Rooms = () => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, dispatch } = useContext(Context);
  const location = useLocation();

  // Media loading cache (avoids repeated skeleton flashes when paginating/back)
  const loadedMediaSrcRef = useRef(new Set());
  const [mediaLoadTick, setMediaLoadTick] = useState(0);

  // Pagination size (user-configurable)
  const [roomsPerPage, setRoomsPerPage] = useState(8);
  const resultsPerPageOptions = [8, 16, 24, 32];

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [activeMediaLoaded, setActiveMediaLoaded] = useState(false);

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

  useEffect(() => {
    const active = mediaList?.[photoIndex];
    if (!active) return;
    if (active.type === 'image' && loadedMediaSrcRef.current.has(active.src)) {
      setActiveMediaLoaded(true);
    } else {
      setActiveMediaLoaded(false);
    }
  }, [photoIndex, mediaList, selectedRoom, mediaLoadTick]);

  const handleNextMedia = () => {
    setPhotoIndex((prev) => (prev + 1) % mediaList.length);
  };

  const handlePrevMedia = () => {
    setPhotoIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const [query, setQuery] = useState("");
  const getPageFromSearchParams = () => {
    const raw = searchParams.get('page');
    const n = Number.parseInt(raw || '1', 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  };
  const [page, setPage] = useState(getPageFromSearchParams);

  // Keep state in sync if URL changes (back/forward / shared links)
  useEffect(() => {
    const urlPage = getPageFromSearchParams();
    if (urlPage !== page) setPage(urlPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'available', 'reserved'
  const [showFilters, setShowFilters] = useState(false);
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterAmenity, setFilterAmenity] = useState("");
  const [filterSecurity, setFilterSecurity] = useState("");
  const [filterCity, setFilterCity] = useState("");

  // Server-side pagination is enabled only for the default browse mode
  // (search + filters need the full dataset for correct matching).
  const useServerPagination =
    query.trim() === "" &&
    filterStatus === "all" &&
    !filterVehicle &&
    !filterAmenity &&
    !filterSecurity &&
    !filterCity;

  const [serverCounts, setServerCounts] = useState({ total: 0, available: 0, reserved: 0 });

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

    const enrichRoomsWithOwnerPhotos = async (roomData) => {
      const roomsWithPhotos = await Promise.all(
        roomData.map(async (room) => {
          if (room.createdBy) {
            try {
              const userQuery = firebaseQuery(
                collection(db, 'users'),
                where('uid', '==', room.createdBy)
              );
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
        })
      );

      return roomsWithPhotos;
    };

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const roomCollection = collection(db, "rooms");

        if (useServerPagination) {
          // Counts (for pageCount + chips)
          const [totalAgg, reservedLegacyAgg, reservedCapacityAgg] = await Promise.all([
            getCountFromServer(roomCollection),
            // Legacy docs
            getCountFromServer(firebaseQuery(roomCollection, where('available', '==', false))),
            // New docs
            getCountFromServer(firebaseQuery(roomCollection, where('capacity', '==', 0))),
          ]);
          const total = totalAgg.data().count || 0;
          const reservedLegacy = reservedLegacyAgg.data().count || 0;
          const reservedNew = reservedCapacityAgg.data().count || 0;
          const reserved = Math.min(total, reservedLegacy + reservedNew);
          const available = Math.max(0, total - reserved);
          if (mounted) setServerCounts({ total, available, reserved });

          const effectivePageCount = Math.max(1, Math.ceil(total / roomsPerPage));
          const clampedPage = Math.min(Math.max(page, 1), effectivePageCount);

          // Fetch only what's needed to render the requested page.
          // Firestore doesn't support offsets, so we read up to the end of the page.
          const fetchLimit = clampedPage * roomsPerPage;
          const snap = await getDocs(
            firebaseQuery(roomCollection, orderBy(documentId()), limit(fetchLimit))
          );

          const allFetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          const start = (clampedPage - 1) * roomsPerPage;
          const pageRooms = allFetched.slice(start, start + roomsPerPage);
          const enriched = await enrichRoomsWithOwnerPhotos(pageRooms);

          if (mounted) {
            setRooms(enriched);
            // Only clamp AFTER we know how many pages exist.
            if (clampedPage !== page) setPage(clampedPage);
          }
        } else {
          // Full fetch mode (needed for search + multi-field filtering)
          const roomSnapshot = await getDocs(roomCollection);
          const roomData = roomSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          const enriched = await enrichRoomsWithOwnerPhotos(roomData);
          if (mounted) setRooms(enriched);
        }
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRooms();
    return () => {
      mounted = false;
    };
  }, [useServerPagination, page, roomsPerPage, query, filterStatus, filterVehicle, filterAmenity, filterSecurity, filterCity]);

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
      const roomToBook = selectedRoom;
      setOpenDialog(false);
      setSelectedRoom(null);
      navigate(`/booking/${roomToBook.id}`, {
        state: {
          room: roomToBook,
          self: !!(currentUser?.email && roomToBook?.ownerEmail && roomToBook.ownerEmail === currentUser.email),
        },
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
      filtered = filtered.filter((r) => isRoomAvailable(r));
    } else if (filterStatus === 'reserved') {
      filtered = filtered.filter((r) => !isRoomAvailable(r));
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
    const available = filtered.filter((r) => isRoomAvailable(r));
    const reserved = filtered.filter((r) => !isRoomAvailable(r));
    return [...available, ...reserved];
  }, [rooms, query, filterStatus, filterVehicle, filterAmenity, filterSecurity, filterCity]);

  // counts for badges (ignoring status filter)
  const counts = useMemo(() => {
    if (useServerPagination) return serverCounts;

    let filtered = rooms.filter(r => matchesQuery(r, query));

    if (filterVehicle) filtered = filtered.filter(r => r.vehicleTypes && r.vehicleTypes.includes(filterVehicle));
    if (filterAmenity) filtered = filtered.filter(r => r.amenities && r.amenities.includes(filterAmenity));
    if (filterSecurity) filtered = filtered.filter(r => r.securityFeatures && r.securityFeatures.includes(filterSecurity));
    if (filterCity) filtered = filtered.filter(r => r.city === filterCity);

    return {
      total: filtered.length,
      available: filtered.filter((r) => isRoomAvailable(r)).length,
      reserved: filtered.filter((r) => !isRoomAvailable(r)).length
    };
  }, [rooms, query, filterVehicle, filterAmenity, filterSecurity, filterCity, serverCounts, useServerPagination]);

  // pagination
  const pageCount = useServerPagination
    ? Math.max(1, Math.ceil((serverCounts.total || 0) / roomsPerPage))
    : Math.max(1, Math.ceil(filteredOrdered.length / roomsPerPage));

  // Sync page -> URL (?page=) for easy sharing
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (page <= 1) next.delete('page');
    else next.set('page', String(page));

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [page, searchParams, setSearchParams]);

  const displayed = useMemo(() => {
    if (useServerPagination) return filteredOrdered;
    const start = (page - 1) * roomsPerPage;
    return filteredOrdered.slice(start, start + roomsPerPage);
  }, [useServerPagination, filteredOrdered, page, roomsPerPage]);

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
        pb: 4,
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
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', sm: 'center' }} 
                sx={{ mb: 2, gap: { xs: 1, sm: 0 } }}
              >
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
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
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
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {displayed.map((room, index) => {
                const capacity = getRoomCapacity(room);
                const isAvailable = capacity > 0;
                const isCommercial = isCommercialListing(room);
                const imgSrc = (room.images && room.images.length ? room.images[0] : "") || "/placeholder-park.jpg";
                const isImgLoaded = loadedMediaSrcRef.current.has(imgSrc);
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
                    <Fade in timeout={300}>
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 2,
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

                        {/* Capacity Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 54,
                            left: 16,
                            zIndex: 2,
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 100,
                            bgcolor: alpha(theme.palette.background.paper, 0.9),
                            color: theme.palette.text.primary,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          Spaces: {capacity}
                        </Box>

                        {/* Listing Type Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 92,
                            left: 16,
                            zIndex: 2,
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 100,
                            bgcolor: alpha(theme.palette.secondary.main, 0.9),
                            color: theme.palette.secondary.contrastText,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.6,
                          }}
                        >
                          {isCommercial ? <GarageIcon sx={{ fontSize: 16 }} /> : <ParkingIcon sx={{ fontSize: 16 }} />}
                          {isCommercial ? 'COMMERCIAL' : 'SINGLE'}
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
                            {!isImgLoaded && (
                              <Skeleton
                                variant="rectangular"
                                width="100%"
                                height="100%"
                                sx={{ position: 'absolute', inset: 0, zIndex: 1 }}
                              />
                            )}
                            <CardMedia
                              component="img"
                              className="room-image"
                              image={imgSrc}
                              alt={room.title}
                              onLoad={() => {
                                if (!loadedMediaSrcRef.current.has(imgSrc)) {
                                  loadedMediaSrcRef.current.add(imgSrc);
                                  setMediaLoadTick((t) => t + 1);
                                }
                              }}
                              onError={() => {
                                if (!loadedMediaSrcRef.current.has(imgSrc)) {
                                  loadedMediaSrcRef.current.add(imgSrc);
                                  setMediaLoadTick((t) => t + 1);
                                }
                              }}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: "cover",
                                transition: "transform 0.6s ease",
                                filter: !isAvailable ? 'grayscale(0.8)' : 'none',
                                opacity: isImgLoaded ? 1 : 0,
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

        {/* Pagination - responsive size */}
        {!loading && filteredOrdered.length > 0 && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mt: 6,
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.6s ease-out",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="rooms-per-page-label">Results per page</InputLabel>
              <Select
                labelId="rooms-per-page-label"
                value={roomsPerPage}
                label="Results per page"
                onChange={(e) => {
                  const nextRoomsPerPage = Number(e.target.value);
                  const currentStartIndex = (page - 1) * roomsPerPage;
                  const nextPage = Math.floor(currentStartIndex / nextRoomsPerPage) + 1;
                  setRoomsPerPage(nextRoomsPerPage);
                  setPage(nextPage);
                }}
              >
                {resultsPerPageOptions.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {pageCount > 1 && (
              <Pagination
                count={pageCount}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
                shape="rounded"
                size={isSmUp ? "large" : "medium"}
                siblingCount={isSmUp ? 1 : 0}
                boundaryCount={1}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    fontWeight: 600,
                  }
                }}
              />
            )}
          </Stack>
        )}
      </Container>

      {/* Enhanced Quick-view Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
        fullScreen={!isSmUp}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 2 },
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
            p: { xs: 2, sm: 3 },
            pb: { xs: 1.5, sm: 2 },
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2 }} sx={{ minWidth: 0 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: { xs: 34, sm: 40 },
                height: { xs: 34, sm: 40 },
                flexShrink: 0,
              }}
            >
              <ParkingIcon />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {selectedRoom?.title || "Parking Space Details"}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.1),
              alignSelf: 'flex-start',
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
            <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2 }, pb: { xs: 1, sm: 2 } }}>
              <Typography variant="body2" color="text.secondary">
                Complete information and booking options
              </Typography>
            </Box>

            <Grid container>
              {/* Images Column */}
              {/* Images Column with Slider */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: "100%",
                      height: { xs: 220, sm: 300 },
                      bgcolor: '#000',
                      borderRadius: 2,
                      overflow: 'hidden',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!activeMediaLoaded && (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{ position: 'absolute', inset: 0, zIndex: 1 }}
                      />
                    )}
                    {/* Media Display */}
                    {mediaList[photoIndex]?.type === 'video' ? (
                      <CardMedia
                        component="video"
                        controls
                        src={mediaList[photoIndex].src}
                        onLoadedData={() => setActiveMediaLoaded(true)}
                        sx={{ width: '100%', height: '100%', opacity: activeMediaLoaded ? 1 : 0 }}
                      />
                    ) : (
                      <CardMedia
                        component="img"
                        src={mediaList[photoIndex]?.src}
                        alt={selectedRoom.title}
                        onLoad={() => {
                          const src = mediaList[photoIndex]?.src;
                          if (src && !loadedMediaSrcRef.current.has(src)) {
                            loadedMediaSrcRef.current.add(src);
                            setMediaLoadTick((t) => t + 1);
                          }
                          setActiveMediaLoaded(true);
                        }}
                        onError={() => setActiveMediaLoaded(true)}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: activeMediaLoaded ? 1 : 0 }}
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
                      (() => {
                        const thumbLoaded = item.type !== 'image' || loadedMediaSrcRef.current.has(item.src);
                        return (
                      <Box
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        sx={{
                          position: 'relative',
                          width: { xs: 64, sm: 80 },
                          height: { xs: 48, sm: 60 },
                          borderRadius: 2,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          opacity: i === photoIndex ? 1 : 0.6,
                          border: i === photoIndex ? `2px solid ${theme.palette.primary.main}` : 'none',
                          transition: "all 0.2s",
                          flexShrink: 0,
                        }}
                      >
                        {!thumbLoaded && (
                          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: 'absolute', inset: 0 }} />
                        )}
                        {item.type === 'video' ? (
                          <Box sx={{ width: '100%', height: '100%', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PlayCircle sx={{ color: 'white' }} />
                          </Box>
                        ) : (
                          <Box
                            component="img"
                            src={item.src}
                            alt={`thumb-${i}`}
                            onLoad={() => {
                              if (!loadedMediaSrcRef.current.has(item.src)) {
                                loadedMediaSrcRef.current.add(item.src);
                                setMediaLoadTick((t) => t + 1);
                              }
                            }}
                            onError={() => {
                              if (!loadedMediaSrcRef.current.has(item.src)) {
                                loadedMediaSrcRef.current.add(item.src);
                                setMediaLoadTick((t) => t + 1);
                              }
                            }}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </Box>
                        );
                      })()
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* Details Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <Stack spacing={3}>
                    {/* Price and Status */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant={isSmUp ? 'h4' : 'h5'}
                          sx={{ fontWeight: 800, color: theme.palette.primary.main }}
                        >
                          ${Number(selectedRoom.price || 0).toFixed(2)}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
                          <Chip
                            label={isRoomAvailable(selectedRoom) ? `Available (${getRoomCapacity(selectedRoom)})` : "Reserved"}
                            color={isRoomAvailable(selectedRoom) ? "success" : "error"}
                            icon={isRoomAvailable(selectedRoom) ? <CheckCircle /> : <Warning />}
                            sx={{ fontWeight: 600 }}
                          />
                          <Chip
                            label={isCommercialListing(selectedRoom) ? "Commercial" : "Single"}
                            color="secondary"
                            icon={isCommercialListing(selectedRoom) ? <GarageIcon /> : <ParkingIcon />}
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
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
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar src={selectedRoom.photoURL} sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                            <PersonIcon />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Hosted by {selectedRoom.ownerName || "Anonymous"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Listed on {prettyDate(selectedRoom.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack 
                          direction={{ xs: 'column', sm: 'row' }} 
                          spacing={1}
                          sx={{ width: '100%' }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedRoom?.createdBy) {
                                navigate(`/seller/${selectedRoom.createdBy}`);
                              }
                            }}
                            sx={{ borderRadius: 2 }}
                          >
                            View Profile
                          </Button>
                          {currentUser?.uid !== selectedRoom?.createdBy && (
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth
                              startIcon={<ChatIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!currentUser)
                                  return navigate('/login', {
                                    state: { redirectTo: location.pathname + location.search },
                                  });
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
                              sx={{ borderRadius: 2 }}
                            >
                              Chat
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        )}

        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            gap: { xs: 1, sm: 1.5 },
            // MUI DialogActions adds `margin-left` between actions by default.
            // When stacked (column) this creates the "stepped" indentation.
            '& > :not(style) + :not(style)': { marginLeft: 0 },
          }}
        >
          <Button
            onClick={handleViewOnMap}
            variant="outlined"
            startIcon={<PlaceIcon />}
            fullWidth={!isSmUp}
            sx={{
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            View on Map
          </Button>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            fullWidth={!isSmUp}
            sx={{
              borderRadius: 2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleBookClick}
            disabled={!isRoomAvailable(selectedRoom)}
            startIcon={<CheckCircle />}
            fullWidth={!isSmUp}
            sx={{
              borderRadius: 2,
              px: { xs: 2, sm: 4 },
              width: { xs: '100%', sm: 'auto' },
            }}
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