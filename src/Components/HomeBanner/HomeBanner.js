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
  keyframes
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useState, useEffect } from "react";

// Slide animation
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

function HomeBanner() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carImages, setCarImages] = useState([]);

  // Mock image paths - you can replace this with actual API call to your backend
  const mockCarImages = [
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

  useEffect(() => {
    // In a real app, you would fetch these from your API
    // For now, using mock images
    setCarImages(mockCarImages);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carImages.length) % carImages.length);
  };

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
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: "100vh" }}>
          {/* Text Content - Left Side */}
          <Grid item xs={12} md={6}>
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
                    10K+
                  </Typography>
                  <Typography variant="body2" color={isDarkMode ? theme.palette.text.secondary : "rgba(255,255,255,0.8)"}>
                    Happy Users
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="700" color={isDarkMode ? theme.palette.text.primary : "white"}>
                    5K+
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
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                height: { xs: "400px", md: "600px" },
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: isDarkMode
                  ? "0 20px 60px rgba(0,0,0,0.4)"
                  : "0 20px 60px rgba(0,0,0,0.2)",
                animation: `${slideIn} 0.8s ease-out`,
              }}
            >
              {/* Slideshow Image */}
              {carImages.length > 0 && (
                <Box
                  component="img"
                  src={carImages[currentSlide]}
                  alt={`Car ${currentSlide + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              )}

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
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: alpha("#000", 0.5),
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    bgcolor: alpha("#000", 0.7),
                    transform: "translateY(-50%) scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>

              <IconButton
                onClick={nextSlide}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  bgcolor: alpha("#000", 0.5),
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    bgcolor: alpha("#000", 0.7),
                    transform: "translateY(-50%) scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>

              {/* Slide Indicator Dots */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
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
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: currentSlide === index ? "white" : alpha("#fff", 0.5),
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "white",
                        transform: "scale(1.2)",
                      },
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