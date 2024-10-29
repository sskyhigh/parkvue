import { Box, Typography, Container, Divider } from "@mui/material";
import { keyframes } from "@emotion/react";

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const drawDivider = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

export default function AboutPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 8,
        mb: 8,
        background: "linear-gradient(135deg, #e0f7fa, #80deea)", // Soft gradient
        borderRadius: 4,
        p: 4,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          color: "primary.main",
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        About ParkVue
      </Typography>
      <Divider
        sx={{
          my: 2,
          height: 2,
          backgroundColor: "primary.main",
          width: "100%",
          animation: `${drawDivider} 0.8s ease-out`,
        }}
      />
      <Box
        sx={{ mt: 3, mb: 3, animation: `${fadeIn} 1s ease-out 0.3s forwards` }}
      >
        <Typography
          variant="h6"
          component="h2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          ParkVue is a revolutionary platform designed to simplify the parking
          experience for New Yorkers.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, color: "text.primary" }}>
          Living in New York City, we understand the struggle of finding a
          parking spot amidst the hustle and bustle. Every minute spent looking
          for parking is a minute lost, so we developed ParkVue - a
          user-friendly platform that allows you to locate available parking
          spaces in real-time. Our platform leverages advanced technology to
          provide you with the most accurate and up-to-date information about
          parking availability.
        </Typography>
      </Box>

      <Divider sx={{ my: 2, height: 2, backgroundColor: "primary.main" }} />

      <Box sx={{ mt: 3, animation: `${fadeIn} 1s ease-out 0.6s forwards` }}>
        <Typography variant="body1">
          Whether you’re planning a trip to the city or just need a place to
          park, ParkVue takes the guesswork out of parking. More than a parking
          locator, ParkVue is a community of New Yorkers helping each other
          navigate the challenges of city parking. By using ParkVue, you’re
          saving time and stress, contributing to a more efficient and less
          congested city.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We believe that by making parking easier, we can make New York City a
          better place to live. Less time spent looking for parking means more
          time spent enjoying the city. Fewer cars searching for parking means
          less traffic and pollution. Welcome to ParkVue, where parking is made
          easy. Together, let’s change the way we park, one spot at a time.
        </Typography>
      </Box>
    </Container>
  );
}
