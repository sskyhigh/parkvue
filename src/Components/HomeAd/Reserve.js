import { Box, Container, Typography, Grid, Card, useTheme, useMediaQuery, alpha } from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Star,
} from '@mui/icons-material';

function Reserve() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    {
      icon: <LocationOn sx={{ fontSize: 48 }} />,
      title: "Choose a Location",
      description: "Simplify your journeys with a personalized space, exclusively for you.",
      color: isDarkMode ? "#6C63FF" : "#00acca"
    },
    {
      icon: <CalendarToday sx={{ fontSize: 48 }} />,
      title: "Check-In Date & Time",
      description: "Save time, money & hassle by booking your space before you set out.",
      color: isDarkMode ? "#FF6584" : "#00bcca"
    },
    {
      icon: <Star sx={{ fontSize: 48 }} />,
      title: "Reserve A Spot",
      description: "Find the best spot, see exactly what you're paying & even extend your stay.",
      color: isDarkMode ? "#4DD0E1" : "#009aba"
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: isDarkMode
          ? "linear-gradient(135deg, #1a1a23 0%, #0f0f15 100%)"
          : "linear-gradient(135deg, #f8fbff 0%, #f0f8ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: isDarkMode
            ? "linear-gradient(45deg, rgba(108, 99, 255, 0.05) 0%, rgba(255, 101, 132, 0.1) 100%)"
            : "linear-gradient(45deg, rgba(0, 172, 202, 0.05) 0%, rgba(0, 188, 202, 0.1) 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: isDarkMode
            ? "linear-gradient(45deg, rgba(108, 99, 255, 0.03) 0%, rgba(77, 208, 225, 0.08) 100%)"
            : "linear-gradient(45deg, rgba(0, 172, 202, 0.03) 0%, rgba(0, 154, 186, 0.08) 100%)",
        }}
      />

      <Container maxWidth="lg">
        {/* Heading Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: "600",
              fontSize: "1.1rem",
              letterSpacing: 2,
              mb: 2,
              display: "block",
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "700",
              fontSize: { xs: "2rem", md: "3rem" },
              background: isDarkMode
                ? theme.palette.primary.main
                : "linear-gradient(45deg, #00acca 30%, #00bcca 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              lineHeight: 1.2,
            }}
          >
            Book With 3 Easy Steps
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? theme.palette.text.secondary : "text.secondary",
              mt: 2,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            Simple, fast, and reliable parking solutions at your fingertips
          </Typography>
        </Box>

        {/* Steps Grid */}
        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  background: isDarkMode
                    ? alpha(theme.palette.background.paper, 0.8)
                    : "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(10px)",
                  border: isDarkMode
                    ? `1px solid ${alpha(theme.palette.divider, 0.2)}`
                    : "1px solid rgba(0, 172, 202, 0.1)",
                  borderRadius: 4,
                  boxShadow: isDarkMode
                    ? "0 8px 32px rgba(0, 0, 0, 0.2)"
                    : "0 8px 32px rgba(0, 172, 202, 0.1)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "visible",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: isDarkMode
                      ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                      : "0 20px 40px rgba(0, 172, 202, 0.15)",
                    background: isDarkMode
                      ? alpha(theme.palette.background.paper, 0.95)
                      : "rgba(255, 255, 255, 0.95)",
                  },
                }}
              >
                {/* Step Number */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 40,
                    height: 40,
                    background: `linear-gradient(45deg, ${step.color}, ${step.color}dd)`,
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "1.2rem",
                    boxShadow: isDarkMode
                      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {index + 1}
                </Box>

                {/* Icon */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 100,
                    height: 100,
                    background: `linear-gradient(135deg, ${step.color}${isDarkMode ? '30' : '15'}, ${step.color}${isDarkMode ? '60' : '30'})`,
                    borderRadius: "50%",
                    mb: 3,
                    transition: "all 0.3s ease",
                    "& .MuiSvgIcon-root": {
                      color: step.color,
                      transition: "all 0.3s ease",
                    },
                    "&:hover": {
                      background: `linear-gradient(135deg, ${step.color}${isDarkMode ? '45' : '30'}, ${step.color}${isDarkMode ? '75' : '45'})`,
                      transform: "scale(1.1)",
                      "& .MuiSvgIcon-root": {
                        transform: "scale(1.1)",
                      },
                    },
                  }}
                >
                  {step.icon}
                </Box>

                {/* Content */}
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: "600",
                    mb: 2,
                    color: isDarkMode ? theme.palette.text.primary : "text.primary",
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? theme.palette.text.secondary : "text.secondary",
                    lineHeight: 1.6,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {step.description}
                </Typography>

                {/* Connector Line (not shown on mobile) */}
                {!isMobile && index < steps.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: -32,
                      width: 64,
                      height: 2,
                      background: isDarkMode
                        ? theme.customStyles?.neonGradient || "linear-gradient(90deg, #6C63FF, #FF6584)"
                        : "linear-gradient(90deg, #00acca, #00bcca)",
                      opacity: 0.3,
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        right: -6,
                        top: -4,
                        width: 0,
                        height: 0,
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        borderLeft: `8px solid ${isDarkMode ? "#6C63FF" : "#00acca"}`,
                      },
                    }}
                  />
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA Button */}
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Box
            component="button"
            sx={{
              background: isDarkMode
                ? theme.customStyles?.neonGradient || "linear-gradient(45deg, #6C63FF, #FF6584)"
                : "linear-gradient(45deg, #00acca, #00bcca)",
              color: "white",
              border: "none",
              padding: "16px 40px",
              fontSize: "1.1rem",
              fontWeight: "600",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: isDarkMode
                ? "0 8px 25px rgba(108, 99, 255, 0.4)"
                : "0 8px 25px rgba(0, 172, 202, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: isDarkMode
                  ? "0 12px 35px rgba(108, 99, 255, 0.6)"
                  : "0 12px 35px rgba(0, 172, 202, 0.4)",
                background: isDarkMode
                  ? "linear-gradient(45deg, #FF6584, #6C63FF)"
                  : "linear-gradient(45deg, #00bcca, #00acca)",
              },
              "&:active": {
                transform: "translateY(-1px)",
              },
            }}
          >
            Get Started Today
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Reserve;