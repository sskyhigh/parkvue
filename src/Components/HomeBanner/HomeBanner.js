import "./HomeBanner.css";
import appstore from "../../img/ios.png";
import playstore from "../../img/play.png";
import {
  Typography,
  Box,
  Grid,
  Container,
  Chip,
  useTheme,
  alpha,
  IconButton,
  keyframes,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  collection,
  query as fsQuery,
  orderBy,
  limit as fsLimit,
  getDocs,
} from "firebase/firestore";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { isRoomAvailable } from "../../utils/capacity";

// Slide animation
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const MOCK_CAR_IMAGES = [
  "/car_images/img1.jpg",
  "/car_images/img2.jpg",
  "/car_images/img3.jpg",
  "/car_images/img4.jpg",
  "/car_images/img5.jpg",
  "/car_images/img6.jpg",
  "/car_images/img7.jpg",
  "/car_images/img8.jpg",
  "/car_images/img9.jpg",
];

function HomeBanner() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carImages, setCarImages] = useState([]);
  const [slides, setSlides] = useState([]); // { src, room }
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch recent rooms and build slides
    let mounted = true;
    const fetchRecentRooms = async () => {
      try {
        const roomsRef = collection(db, "rooms");
        const q = fsQuery(
          roomsRef,
          orderBy("createdAt", "desc"),
          // Fetch more than we need, then filter client-side for capacity/legacy availability
          fsLimit(30)
        );
        const snap = await getDocs(q);
        if (!mounted) return;
        const rooms = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const roomSlides = [];
        rooms.forEach((r) => {
          if (!isRoomAvailable(r)) return;
          if (r.images && r.images.length > 0) {
            roomSlides.push({ src: r.images[0], room: r });
          }
        });

        const limitedSlides = roomSlides.slice(0, 9);

        if (limitedSlides.length > 0) {
          setSlides(limitedSlides);
          setCarImages(limitedSlides.map((s) => s.src));
        } else {
          // fallback to static images
          setSlides(MOCK_CAR_IMAGES.map((s) => ({ src: s, room: null })));
          setCarImages(MOCK_CAR_IMAGES);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        // fallback to static images on error
        setSlides(MOCK_CAR_IMAGES.map((s) => ({ src: s, room: null })));
        setCarImages(MOCK_CAR_IMAGES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentRooms();
    return () => { mounted = false; };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, carImages.length));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, carImages.length)) % Math.max(1, carImages.length));
  };

  // autoplay every 5s
  useEffect(() => {
    if (isPaused || carImages.length === 0) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carImages.length);
    }, 9000);
    return () => clearInterval(id);
  }, [isPaused, carImages.length]);

  // reset currentSlide if slides change and index out of range
  useEffect(() => {
    if (currentSlide >= carImages.length) setCurrentSlide(0);
  }, [carImages.length, currentSlide]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDarkMode
          ? theme.customStyles?.heroBackground || "linear-gradient(135deg, #0f0f15 0%, #1a1a23 50%, #0f0f15 100%)"
          : "linear-gradient(135deg, #667eea 0%, #6094b8ff 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.1)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: isDarkMode
            ? "rgba(255,255,255,0.02)"
            : "rgba(255,255,255,0.05)",
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ minHeight: "100vh", pt: { xs: 1, md: 12 }}}>
          {/* Text Content - Left Side */}
          <Grid item xs={12} md={5.8}>
            <Box
              sx={{
                color: isDarkMode ? theme.palette.text.primary : "white",
                textAlign: { xs: "center", md: "left" },
                py: { xs: 8, md: 0 },
              }}
            >
              {/* Badge */}
              <Chip
                label="Parking Made Simple"
                sx={{
                  bgcolor: isDarkMode
                    ? alpha(theme.palette.primary.main, 0.2)
                    : "rgba(255,255,255,0.2)",
                  color: isDarkMode
                    ? theme.palette.primary.main
                    : "white",
                  fontWeight: "600",
                  mb: 3,
                  backdropFilter: "blur(10px)",
                  border: isDarkMode
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                    : "none",
                }}
              />

              {/* Main Heading */}
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "800",
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  lineHeight: 1.1,
                  mb: 2,
                  background: isDarkMode
                    ? "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)"
                    : "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Discover, Earn,
                <Box
                  component="span"
                  sx={{
                    background: isDarkMode
                      ? "linear-gradient(45deg, #FFD700 30%, #FFEC8B 90%)"
                      : "linear-gradient(45deg, #FFD700 30%, #FFEC8B 90%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    display: "block",
                  }}
                >
                  and Share.
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  mb: 4,
                  color: isDarkMode
                    ? theme.palette.text.secondary
                    : "rgba(255,255,255,0.9)",
                  lineHeight: 1.6,
                  maxWidth: "500px",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Tell us where and when you need parking, and we'll find you the perfect spot instantly.
              </Typography>

              {/* App Stores */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                  flexWrap: "wrap",
                  mb: 4,
                }}
              >
                {[
                  { src: appstore, alt: "Download on App Store" },
                  { src: playstore, alt: "Get it on Google Play" },
                ].map((store, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    <Box
                      component="img"
                      src={store.src}
                      alt={store.alt}
                      sx={{
                        height: 50,
                        cursor: "not-allowed",
                        transition: "transform 0.2s ease",
                        "&:hover": { transform: "translateY(-2px)" },
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: 0,
                        bgcolor: isDarkMode
                          ? theme.palette.error.dark
                          : "error.main",
                        color: "white",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        px: 1,
                        py: "1px",
                        borderRadius: "12px",
                        textTransform: "uppercase",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        border: "2px solid white",
                      }}
                    >
                      Coming Soon
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 4,
                  mt: 6,
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="700" color={isDarkMode ? theme.palette.text.primary : "white"}>
                    1K+
                  </Typography>
                  <Typography variant="body2" color={isDarkMode ? theme.palette.text.secondary : "rgba(255,255,255,0.8)"}>
                    Happy Users
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="700" color={isDarkMode ? theme.palette.text.primary : "white"}>
                    500+
                  </Typography>
                  <Typography variant="body2" color={isDarkMode ? theme.palette.text.secondary : "rgba(255,255,255,0.8)"}>
                    Parking Spots
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="700" color={isDarkMode ? theme.palette.text.primary : "white"}>
                    50+
                  </Typography>
                  <Typography variant="body2" color={isDarkMode ? theme.palette.text.secondary : "rgba(255,255,255,0.8)"}>
                    Cities
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Slideshow - Right Side */}
          <Grid item xs={12} md={6.2}>
            <Box
              sx={{
                position: "relative",
                height: { xs: "400px", md: "550px" },
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: isDarkMode
                  ? "0 20px 60px rgba(0,0,0,0.4)"
                  : "0 20px 60px rgba(0,0,0,0.2)",
                animation: `${slideIn} 0.8s ease-out`,
              }}
            >
              {/* Loading State */}
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ borderRadius: 4 }}
                />
              ) : (
                <>
                  {/* Slideshow (flex sliding) */}
                  <Box
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  {carImages.map((img, idx) => {
                    const slide = slides[idx] || { src: img, room: null };
                    const offset = (idx - currentSlide) * 100;
                    return (
                      <Box
                        key={idx}
                        onClick={() => {
                          if (slide.room && slide.room.id) {
                            navigate(`/booking/${slide.room.id}`, { state: { room: slide.room } });
                          }
                        }}
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "100%",
                          height: "100%",
                          transform: `translateX(${offset}%)`,
                          transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
                          cursor: slide.room ? "pointer" : "default",
                        }}
                      >
                        <Box
                          component="img"
                          src={slide.src}
                          alt={`Slide ${idx + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15) 40%, transparent)",
                            pointerEvents: "none",
                          }}
                        />
                        {slide.room && (
                          <Chip
                            label={slide.room.city || slide.room.title || "Listing"}
                            size="small"
                            sx={{
                              position: "absolute",
                              left: 12,
                              top: 12,
                              bgcolor: alpha(theme.palette.primary.main, 0.9),
                              color: "white",
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Image Overlay Gradient */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  opacity: 0.8,
                }}
              />

              {/* Navigation Buttons */}
              <IconButton
                onClick={prevSlide}
                aria-label="previous"
                sx={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: alpha("#000", 0.45),
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
                  "&:hover": { bgcolor: alpha("#000", 0.7), transform: "translateY(-50%) scale(1.05)" },
                }}
              >
                <ChevronLeft fontSize="medium" />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                aria-label="next"
                sx={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: alpha("#000", 0.45),
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
                  "&:hover": { bgcolor: alpha("#000", 0.7), transform: "translateY(-50%) scale(1.05)" },
                }}
              >
                <ChevronRight fontSize="medium" />
              </IconButton>

              {/* Slide Indicator Dots */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 18,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 1,
                }}
              >
                {carImages.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    sx={{
                      width: currentSlide === index ? 12 : 8,
                      height: currentSlide === index ? 12 : 8,
                      borderRadius: "50%",
                      bgcolor: currentSlide === index ? "white" : alpha("#fff", 0.45),
                      cursor: "pointer",
                      transition: "all 220ms ease",
                      boxShadow: currentSlide === index ? "0 4px 12px rgba(0,0,0,0.35)" : "none",
                    }}
                  />
                ))}
              </Box>

                  {/* Image Counter */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      color: "white",
                      bgcolor: alpha("#000", 0.5),
                      backdropFilter: "blur(10px)",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      fontSize: "0.9rem",
                    }}
                  >
                    {currentSlide + 1} / {carImages.length}
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          color: isDarkMode ? theme.palette.text.primary : "white",
          textAlign: "center",
          display: { xs: "none", md: "block" },
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 1 }}>
          Scroll to explore
        </Typography>
        <Box
          sx={{
            width: 2,
            height: 30,
            background: isDarkMode
              ? alpha(theme.palette.text.primary, 0.5)
              : "rgba(255,255,255,0.5)",
            mx: "auto",
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  );
}

export default HomeBanner;