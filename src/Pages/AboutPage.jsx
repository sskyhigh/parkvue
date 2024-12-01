import {
  Box,
  Typography,
  Container,
  Divider,
  Grid,
  Avatar,
} from "@mui/material";
import { keyframes } from "@emotion/react";

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0.7; transform: translateY(-25px); }
  to { opacity: 1; transform: translateY(0px); }
`;

const drawDivider = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

export default function AboutPage() {
  return (
    <Box
      sx={{
        minHeight: "87vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4f8, #a9cce3)", // Subtle gradient
      }}
    >
      <Container
        maxWidth="2xl"
        sx={{
          background: "#a9cce3",
          borderRadius: 2,
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          overflow: "hidden",
          px: 2,
        }}
      >
        <Grid container>
          {/* Developer Section */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              background: "linear-gradient(135deg, #00bcd4, #0288d1)", // Gradient for dev section
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              py: { xs: 4, md: 31 },
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              About the Developer
            </Typography>
            <Avatar
              src="https://via.placeholder.com/150" // Replace with actual image if you want
              alt="Shao Yan"
              sx={{
                width: 120,
                height: 120,
                border: "3px solid white",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Shao Yan
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Brooklyn, NYC
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Email:{" "}
              <a
                href="mailto:shaoyan888@gmail.com"
                style={{ color: "white", textDecoration: "none" }}
              >
                shaoyan888@gmail.com
              </a>
            </Typography>
            <Divider
              sx={{
                width: "80%",
                my: 2,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              }}
            />
            <Typography
              variant="body1"
              align="center"
              sx={{
                fontStyle: "italic",
                fontSize: "0.95rem",
              }}
            >
              "A visionary developer who believes in using technology to
              simplify everyday problems. Passionate about creating efficient,
              impactful solutions that make a difference."
            </Typography>
          </Grid>

          {/* About Text Section */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              py: { xs: 4, md: 30 },
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
                animation: `${fadeIn} 0.3s ease-out`,
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
                animation: `${drawDivider} 0.5s ease-out`,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                mb: 3,
                animation: `${fadeIn} 0.7s ease-out 0.3s forwards`,
              }}
            >
              ParkVue is a revolutionary platform designed to simplify the
              parking experience for New Yorkers. Living in New York City, we
              understand the struggle of finding a parking spot amidst the
              hustle and bustle. Every minute spent looking for parking is a
              minute lost, so we developed ParkVue— a user-friendly platform
              that allows you to locate available parking spaces in real-time.
              Our platform leverages advanced technology to provide you with the
              most accurate and up-to-date information about parking
              availability.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                mb: 3,
                animation: `${fadeIn} 0.7s ease-out 0.5s forwards`,
              }}
            >
              Whether you’re planning a trip to the city or just need a place to
              park, ParkVue takes the guesswork out of parking. More than a
              parking locator, ParkVue is a community of New Yorkers helping
              each other navigate the challenges of city parking. By using
              ParkVue, you’re saving time and stress, contributing to a more
              efficient and less congested city.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                animation: `${fadeIn} 0.7s ease-out 0.7s forwards`,
              }}
            >
              We believe that by making parking easier, we can make New York
              City a better place to live. Less time spent looking for parking
              means more time spent enjoying the city. Fewer cars searching for
              parking means less traffic and pollution. Welcome to ParkVue,
              where parking is made easy. Together, let’s change the way we
              park, one spot at a time.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
