import { Box, Typography, Button, Container, useTheme, keyframes, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, SentimentDissatisfied } from '@mui/icons-material';

// Animation for floating effect
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const NotFound = ({ information }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: isDarkMode
            ? `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.4)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.7)} 0%, transparent 70%)`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: isDarkMode
            ? `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.4)} 0%, transparent 70%)`
            : `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.6)} 0%, transparent 70%)`,
        }}
      />

      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: { xs: 4, md: 6 },
            background: isDarkMode
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: isDarkMode
              ? '0 10px 30px rgba(0,0,0,0.3)'
              : '0 10px 30px rgba(0,0,0,0.1)',
            border: isDarkMode
              ? `1px solid ${alpha(theme.palette.divider, 0.2)}`
              : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          {/* Animated icon */}
          <Box
            sx={{
              animation: `${floatAnimation} 3s ease-in-out infinite`,
              mb: 4,
            }}
          >
            <SentimentDissatisfied
              sx={{
                fontSize: 120,
                color: theme.palette.primary.main,
                opacity: 0.9,
              }}
            />
          </Box>

          {/* 404 Number */}
          <Typography
            variant="h1"
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '6rem', md: '8rem', lg: '10rem' },
              background: theme.palette.primary.main,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Title */}
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              color: theme.palette.text.primary,
            }}
          >
            Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            The {information ? information : "page"} you are looking for might have been removed, 
            had its name changed, or is temporarily unavailable.
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '50px',
              textTransform: 'none',
              background: theme.customStyles?.neonGradient || `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: isDarkMode
                ? `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
                : `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: isDarkMode
                  ? `0 12px 35px ${alpha(theme.palette.primary.main, 0.6)}`
                  : `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              },
            }}
          >
            Go Back to Home
          </Button>

          {/* Additional helpful text */}
          <Typography
            variant="body2"
            sx={{
              mt: 4,
              color: theme.palette.text.disabled,
              fontSize: '0.9rem',
            }}
          >
            If you believe this is an error, please contact support
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;