import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Stack,
  Divider,
  useTheme,
  alpha,
  Skeleton,
  Button,
} from "@mui/material";
import {
  LocationOn,
  Description,
  Store,
  ArrowBack,
  CheckCircle,
  Cancel,
  MeetingRoom,
  Star as StarIcon,
} from "@mui/icons-material";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useValue } from "../../context/ContextProvider";
import { getRoomCapacity, isRoomAvailable } from "../../utils/capacity";

const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { dispatch } = useValue();

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

  const [seller, setSeller] = useState(null);
  const [sellerRooms, setSellerRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // Fetch seller data
  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", sellerId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const sellerDoc = querySnapshot.docs[0];
          setSeller({ id: sellerDoc.id, ...sellerDoc.data() });
        } else {
          setSeller(null);
          dispatch({
            type: "UPDATE_ALERT",
            payload: {
              open: true,
              severity: "error",
              message: "Seller not found",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching seller:", error);
        dispatch({
          type: "UPDATE_ALERT",
          payload: {
            open: true,
            severity: "error",
            message: error.message || "Failed to load seller profile",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchSeller();
    }
  }, [sellerId, dispatch]);

  // Fetch seller's rooms
  useEffect(() => {
    const fetchSellerRooms = async () => {
      if (!sellerId) return;
      setRoomsLoading(true);
      try {
        const roomsRef = collection(db, "rooms");
        const q = query(roomsRef, where("createdBy", "==", sellerId));
        const roomSnapshot = await getDocs(q);
        const roomData = roomSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by availability - available first (capacity-aware)
        roomData.sort((a, b) => {
          const aAvail = isRoomAvailable(a);
          const bAvail = isRoomAvailable(b);
          if (aAvail === bAvail) return 0;
          return aAvail ? -1 : 1;
        });

        setSellerRooms(roomData);
      } catch (error) {
        console.error("Error fetching seller rooms:", error);
        dispatch({
          type: "UPDATE_ALERT",
          payload: {
            open: true,
            severity: "error",
            message: error.message || "Failed to load seller's listings",
          },
        });
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchSellerRooms();
  }, [sellerId, dispatch]);

  const handleRoomClick = (roomId) => {
    navigate(`/booking/${roomId}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "auto",
          pt: 2,
          background: theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 3 }} />
          <Grid container spacing={3}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!seller) {
    return (
      <Box
        sx={{
          minHeight: "auto",
          pt: 4,
          background: theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              background: theme.customStyles.cardGlass.background,
              border: theme.customStyles.cardGlass.border,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Seller Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The seller profile you're looking for doesn't exist.
            </Typography>
            <Button variant="contained" onClick={handleBackClick}>
              Go Back
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const availableCount = sellerRooms.filter((r) => isRoomAvailable(r)).length;
  const reservedCount = sellerRooms.filter((r) => !isRoomAvailable(r)).length;

  return (
    <Box
      sx={{
        minHeight: "auto",
        pt: 2,
        pb: 4,
        background: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          onClick={handleBackClick}
          startIcon={<ArrowBack />}
          sx={{
            mb: 2,
            color: theme.palette.text.primary,
            textTransform: 'none',
            fontWeight: 600,
            "&:hover": {
              background: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          Back
        </Button>

        {/* Seller Profile Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            background: theme.customStyles.heroBackground,
            color: "white",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "200px",
              height: "200px",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.common.white,
                0.1
              )} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
              opacity: 0.5,
            },
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md="auto">
              <Avatar
                src={seller.photoURL || "/default-avatar.png"}
                alt={seller.fullName || "Seller"}
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  border: `4px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  boxShadow: `0 8px 24px ${alpha("#000", 0.3)}`,
                }}
              />
            </Grid>
            <Grid item xs={12} md>
              <Stack spacing={2}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  {seller.fullName || "Unknown Seller"}
                </Typography>

                {seller.description && (
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Description sx={{ fontSize: 20, mt: 0.5, opacity: 0.9 }} />
                    <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                      {seller.description}
                    </Typography>
                  </Stack>
                )}

                {(seller.city || seller.state || seller.address) && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOn sx={{ fontSize: 20, opacity: 0.9 }} />
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {[seller.address, seller.city, seller.state]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  </Stack>
                )}

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.25}
                  useFlexGap
                  flexWrap="wrap"
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  sx={{
                    width: '100%',
                    '& .MuiChip-root': { maxWidth: '100%' },
                  }}
                >
                  <Chip
                    icon={<Store />}
                    label={`${sellerRooms.length} Listing${sellerRooms.length !== 1 ? "s" : ""}`}
                    sx={{
                      ...chipSx,
                      width: { xs: '100%', sm: 'auto' },
                      background: alpha(theme.palette.common.white, 0.2),
                      color: "white",
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                  <Chip
                    icon={<CheckCircle />}
                    label={`${availableCount} Available`}
                    sx={{
                      ...chipSx,
                      width: { xs: '100%', sm: 'auto' },
                      background: alpha(theme.palette.success.main, 0.3),
                      color: "white",
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                  <Chip
                    icon={<Cancel />}
                    label={`${reservedCount} Reserved`}
                    sx={{
                      ...chipSx,
                      width: { xs: '100%', sm: 'auto' },
                      background: alpha(theme.palette.error.main, 0.3),
                      color: "white",
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: "white" },
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Seller's Listings Section */}
        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ mb: 3 }}
          >
            <MeetingRoom
              sx={{ fontSize: 32, color: theme.palette.primary.main }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              Listings
            </Typography>
          </Stack>

          {roomsLoading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                  <Skeleton sx={{ mt: 1 }} />
                  <Skeleton width="60%" />
                </Grid>
              ))}
            </Grid>
          ) : sellerRooms.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                background: theme.customStyles.cardGlass.background,
                border: theme.customStyles.cardGlass.border,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No listings available yet
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {sellerRooms.map((room) => {
                const isAvailable = isRoomAvailable(room);
                const capacity = getRoomCapacity(room);
                const firstImage =
                  room.images && room.images.length > 0
                    ? room.images[0]
                    : "/placeholder-park.jpg";

                return (
                  <Grid item xs={12} sm={6} md={4} key={room.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        background: theme.customStyles.cardGlass.background,
                        border: theme.customStyles.cardGlass.border,
                        backdropFilter: theme.customStyles.cardGlass.backdropFilter,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 12px 24px ${alpha(
                            theme.palette.primary.main,
                            0.2
                          )}`,
                        },
                      }}
                    >
                      <CardActionArea
                        onClick={() => handleRoomClick(room.id)}
                        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", flex: 1 }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={firstImage}
                            alt={room.title || "Parking spot"}
                            sx={{
                              objectFit: "cover",
                              flexShrink: 0,
                              filter: isAvailable ? "none" : "grayscale(50%)",
                            }}
                          />
                          <Chip
                            label={isAvailable ? `Available (${capacity})` : "Reserved"}
                            size="small"
                            icon={
                              isAvailable ? (
                                <CheckCircle sx={{ fontSize: 16 }} />
                              ) : (
                                <Cancel sx={{ fontSize: 16 }} />
                              )
                            }
                            sx={{
                              ...chipSx,
                              position: "absolute",
                              top: 12,
                              right: 12,
                              background: isAvailable
                                ? alpha(theme.palette.success.main, 0.9)
                                : alpha(theme.palette.error.main, 0.9),
                              color: "white",
                              fontWeight: 600,
                              "& .MuiChip-icon": { color: "white" },
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              fontWeight: 700,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {room.title || "Untitled Listing"}
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <LocationOn
                              sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {room.city || room.address || "Location not specified"}
                            </Typography>
                          </Stack>

                          {room.ratingCount > 0 ? (
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                              <StarIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {(room.averageRating || 0).toFixed(1)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ({room.ratingCount})
                              </Typography>
                            </Stack>
                          ) : (
                            <Chip
                              size="small"
                              label="no ratings yet"
                              sx={{
                                ...chipSx,
                                height: 24,
                                mb: 1,
                                bgcolor: alpha(theme.palette.grey[300], 0.1),
                                color: theme.palette.text.secondary,
                                fontWeight: 500,
                                border: 'none',
                              }}
                            />
                          )}

                          <Divider sx={{ my: 1.5 }} />

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                              }}
                            >
                              ${room.price || 0}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                /day
                              </Typography>
                            </Typography>
                            {room.viewCount > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                {room.viewCount} view{room.viewCount !== 1 ? "s" : ""}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SellerProfile;
