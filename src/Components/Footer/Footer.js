import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Typography, IconButton, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { GitHub, LinkedIn, Email } from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const footerBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.85)
      : alpha(theme.palette.background.paper, 0.95);

  const borderColor = alpha(theme.palette.primary.main, 0.2);

  const linkStyle = {
    color: theme.palette.text.secondary,
    textDecoration: "none",
    fontSize: "0.875rem",
    transition: "color 0.2s ease",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  };

  const socialLinks = [
    {
      icon: <GitHub fontSize="small" />,
      href: "https://github.com/sskyhigh",
      label: "GitHub",
      hoverColor: isDarkMode ? "#fff" : "#333",
    },
    {
      icon: <LinkedIn fontSize="small" />,
      href: "https://www.linkedin.com/in/shaoyan8/",
      label: "LinkedIn",
      hoverColor: "#0077B5",
    },
    {
      icon: <Email fontSize="small" />,
      href: "mailto:slow160boys@gmail.com",
      label: "Email",
      hoverColor: "#EA4335",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: footerBg,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${borderColor}`,
        py: 1,
        px: 2,
        flexShrink: 0,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1.5, sm: 0 },
          }}
        >
          {/* Left Side - Copyright & Links */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, fontSize: "0.875rem" }}
            >
              All Rights Reserved © Parkvue
            </Typography>

            <Typography
              sx={{ color: alpha(theme.palette.text.secondary, 0.5), mx: 0.5 }}
            >
              |
            </Typography>

            <Box
              component={Link}
              to="/terms"
              sx={linkStyle}
            >
              Terms
            </Box>

            <Typography
              sx={{ color: alpha(theme.palette.text.secondary, 0.5), mx: 0.5 }}
            >
              |
            </Typography>

            <Box
              component={Link}
              to="/privacy"
              sx={linkStyle}
            >
              Privacy
            </Box>

            <Typography
              sx={{ color: alpha(theme.palette.text.secondary, 0.5), mx: 0.5 }}
            >
              |
            </Typography>

            <Box
              component={Link}
              to="/security"
              sx={linkStyle}
            >
              Security
            </Box>

            <Typography
              sx={{ color: alpha(theme.palette.text.secondary, 0.5), mx: 0.5 }}
            >
              |
            </Typography>

            <Box
              component={Link}
              to="/contact"
              sx={linkStyle}
            >
              Contact Us
            </Box>
          </Box>

          {/* Right Side - Social Icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                component="a"
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={social.label}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: social.hoverColor,
                    transform: "translateY(-2px)",
                    background: alpha(social.hoverColor, 0.1),
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
