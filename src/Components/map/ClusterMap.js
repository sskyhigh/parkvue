import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  useTheme,
  CardMedia,
  Typography,
  Avatar,
  Stack,
  alpha,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle,
  Warning
} from "@mui/icons-material";

import ArrowForward from "@mui/icons-material/ArrowForward";
import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
} from "react-map-gl";
import { useNavigate, useLocation } from "react-router-dom";
import { useValue } from "../../context/ContextProvider";
import { db, collection, getDocs } from "../../firebase/config";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "./Geocoder";
import {
  LocationOn as LocationIcon,
  LocalParking as ParkingIcon,
} from "@mui/icons-material";

const ClusterMap = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const isDark = theme.palette.mode === "dark";

  const mapStyle = isDark
    ? "mapbox://styles/mapbox/navigation-night-v1"
    : "mapbox://styles/mapbox/streets-v12";

  const defaultLocation = { lng: -74.006, lat: 40.7128 };

  const {
    state: {
      location: { lng, lat },
    },
    dispatch,
  } = useValue();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(state?.room || null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [viewState, setViewState] = useState(() => {
    if (selectedRoom?.lat && selectedRoom?.lng) {
      return {
        longitude: selectedRoom.lng,
        latitude: selectedRoom.lat,
        zoom: 12,
      };
    }

    return {
      longitude: lng || defaultLocation.lng,
      latitude: lat || defaultLocation.lat,
      zoom: 12,
    };
  });

  // Center map on selected room
  useEffect(() => {
    if (selectedRoom?.lat && selectedRoom?.lng) {
      setViewState(prev => ({
        ...prev,
        longitude: selectedRoom.lng,
        latitude: selectedRoom.lat,
      }));
    }
  }, [selectedRoom]);

  const mapRef = useRef();

  // Fetch all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out rooms without coordinates
        const validRooms = roomsData.filter(room => room.lat && room.lng);
        setRooms(validRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Auto-locate user
  useEffect(() => {
    if (!lng && !lat) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 12,
              essential: true,
            });
          }
          dispatch({
            type: "UPDATE_LOCATION",
            payload: { lng: longitude, lat: latitude },
          });
          setViewState(prev => ({
            ...prev,
            longitude,
            latitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          dispatch({ type: "UPDATE_LOCATION", payload: defaultLocation });
        },
        { enableHighAccuracy: true }
      );
    }
  }, [dispatch, lng, lat]);

  // Handle marker click
  const handleMarkerClick = (room, event) => {
    event.stopPropagation();
    setSelectedRoom(room);
  };

  // Close popup
  const handleClosePopup = () => {
    setSelectedRoom(null);
  };

  // Custom marker component
  const CustomMarker = ({ room, onClick }) => {
    const isAvailable = room.available !== false;

    return (
      <Marker
        longitude={room.lng}
        latitude={room.lat}
        anchor="bottom"
      >
        <Box
          sx={{
            position: "relative",
            cursor: "pointer",
            transform: "translateY(-100%)",
          }}
          onClick={onClick}
          onMouseEnter={() => setHoveredRoom(room.id)}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          {/* Marker pin */}
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `12px solid ${isAvailable ? theme.palette.primary.main : theme.palette.error.main}`,
            }}
          />

          {/* Marker body */}
          <Avatar
            sx={{
              bgcolor: isAvailable ? theme.palette.primary.main : theme.palette.error.main,
              color: "white",
              width: 36,
              height: 36,
              boxShadow: theme.shadows[4],
              border: `2px solid white`,
              transform: hoveredRoom === room.id ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
          >
            <ParkingIcon />
          </Avatar>
        </Box>
      </Marker>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        width: "100%",
        background: theme.palette.customStyles?.heroBackground || theme.palette.background.default,
      }}
    >
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 137,
            left: "10%",
            transform: "translateX(-50%)",
            px: 2.5,
            py: 1.2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            boxShadow: 3,
            zIndex: 2000,
          }}
        >
          <CircularProgress size={24} thickness={5} />
          <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
            Loading parking spaces…
          </Typography>
        </Box>
      )}

      {/* Map container */}
      <Box sx={{ height: "100%", width: "100%" }}>
        <ReactMapGL
          ref={mapRef}
          mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle={mapStyle}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Room markers */}
          {rooms.map((room) => (
            <CustomMarker
              key={room.id}
              room={room}
              onClick={(e) => handleMarkerClick(room, e)}
            />
          ))}

          {/* Selected room popup */}
          {selectedRoom && (
            <Popup
              latitude={selectedRoom.lat}
              longitude={selectedRoom.lng}
              anchor="bottom"
              onClose={handleClosePopup}
              closeButton={false} // Remove default close button
              closeOnClick={false}
              offset={[0, -41]} // Reduced offset
              zIndex={2001}
              style={{
                padding: 0,
                background: "none",
                border: "none",
                boxShadow: "none",
                maxWidth: "none",
                zIndex: 2001,
              }}
            >
              <Paper
                elevation={8}
                sx={{
                  width: 320,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  bgcolor: theme.palette.background.paper,
                  position: "relative",
                  zIndex: 10000,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[12],
                    borderColor: theme.palette.primary.main,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClosePopup();
                  navigate(`/booking/${selectedRoom.id}`, {
                    state: { room: selectedRoom }
                  });
                }}
              >
                {/* Custom close button */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClosePopup();
                  }}
                  sx={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    zIndex: 20,
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: "blur(4px)",
                    "&:hover": {
                      bgcolor: theme.palette.error.main,
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                {/* Room Image */}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={selectedRoom.images?.[0] || "/placeholder-park.jpg"}
                    alt={selectedRoom.title}
                    sx={{
                      objectFit: "cover",
                      width: "100%",
                      filter: selectedRoom.available !== false ? "none" : "grayscale(0.7) brightness(0.4)",
                    }}
                  />

                  {/* Price badge */}
                  <Chip
                    label={`$${Number(selectedRoom.price || 0).toFixed(2)}`}
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      left: 12,
                      bgcolor: alpha(theme.palette.primary.main, 0.95),
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      height: 28,
                    }}
                  />

                  {/* Availability badge */}
                  <Chip
                    icon={selectedRoom.available !== false ? <CheckCircle fontSize="small" /> : <Warning fontSize="small" />}
                    label={selectedRoom.available !== false ? "Available" : "Reserved"}
                    color={selectedRoom.available !== false ? "success" : "error"}
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </Box>

                {/* Room Info */}
                <Box sx={{ p: 2.5 }}>
                  <Stack spacing={2}>
                    {/* Title */}
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          color: theme.palette.text.primary,
                          lineHeight: 1.2,
                          mb: 0.5,
                        }}
                      >
                        {selectedRoom.title || "Untitled Space"}
                      </Typography>

                      {/* Location with icon */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationIcon
                          sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                          }}
                        >
                          {selectedRoom.city
                            ? `${selectedRoom.city}, ${selectedRoom.state || ""}`
                            : selectedRoom.fullAddress || "Location not specified"}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.4,
                        height: "2.8em",
                      }}
                    >
                      {selectedRoom.description || "No description available"}
                    </Typography>

                    {/* Vehicle Types */}
                    {selectedRoom.vehicleTypes?.length > 0 && (
                      <Stack spacing={1}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                          VEHICLE TYPES
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {selectedRoom.vehicleTypes.slice(0, 3).map((type, index) => (
                            <Chip
                              key={index}
                              label={type}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: "0.7rem",
                                height: 22,
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    )}

                    {/* Footer with CTA */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        pt: 1,
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Click to book
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        endIcon={<ArrowForward fontSize="small" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClosePopup();
                          navigate(`/booking/${selectedRoom.id}`, {
                            state: { room: selectedRoom }
                          });
                        }}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            </Popup>
          )}

          {/* Map controls */}
          <NavigationControl
            position="bottom-right"
            style={{ margin: 10 }}
          />
          <GeolocateControl
            position="top-left"
            trackUserLocation
            onGeolocate={(e) =>
              dispatch({
                type: "UPDATE_LOCATION",
                payload: {
                  lng: e.coords.longitude,
                  lat: e.coords.latitude,
                },
              })
            }
            style={{ margin: 10 }}
          />
          <Geocoder />
        </ReactMapGL>
      </Box>

      {/* Stats overlay */}
      {!loading && (
        <Box
          sx={{
            position: "absolute",
            top: 5,
            left: 45,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            borderRadius: 2,
            p: 2,
            boxShadow: theme.shadows[4],
            zIndex: 1,
          }}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Parking Spaces
            </Typography>
            <Stack spacing={0.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: theme.palette.primary.main,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {rooms.filter(r => r.available !== false).length} Available
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: theme.palette.error.main,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {rooms.filter(r => r.available === false).length} Reserved
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: theme.palette.text.secondary,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {rooms.length} Total
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ClusterMap;