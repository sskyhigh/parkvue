import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  keyframes
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  MonetizationOn,
  Security,
  People,
  LocalParking,
  EmojiEvents,
  TrendingUp,
  CheckCircle,
  GitHub,
  LinkedIn,
  Email
} from '@mui/icons-material';

// Define animations
const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

function About() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Features with icons
  const features = [
    {
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      title: "Find Spots Instantly",
      description: "Real-time availability and precise location mapping"
    },
    {
      icon: <Schedule sx={{ fontSize: 40 }} />,
      title: "24/7 Booking",
      description: "Book parking anytime, anywhere with instant confirmation"
    },
    {
      icon: <MonetizationOn sx={{ fontSize: 40 }} />,
      title: "Fair Pricing",
      description: "Transparent pricing with no hidden fees"
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: "Secure & Verified",
      description: "All spots and users are verified for your safety"
    }
  ];

  // Stats data
  const stats = [
    {
      value: "10,000+",
      label: "Happy Users",
      icon: <People />,
      description: "Active community members"
    },
    {
      value: "5,000+",
      label: "Parking Spots",
      icon: <LocalParking />,
      description: "Verified parking locations"
    },
    {
      value: "5",
      label: "Cities",
      icon: <EmojiEvents />,
      description: "Across major metropolitan areas"
    },
    {
      value: "98%",
      label: "Satisfaction",
      icon: <TrendingUp />,
      description: "User satisfaction rate"
    }
  ];

  // Mission highlights
  const missionPoints = [
    "Reduce urban congestion",
    "Optimize parking space utilization",
    "Provide affordable parking solutions",
    "Create sustainable urban mobility",
    "Empower local communities",
    "Enhance city living experience"
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: { xs: 2, md: 3 },
        pb: { xs: 6, md: 8 },
        background: theme.palette.customStyles?.heroBackground || theme.palette.background.default,
        position: 'relative',
        animation: `${fadeInUp} 0.8s ease-out`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: 3,
              mb: 2,
              display: 'block',
            }}
          >
            ABOUT PARKVUE
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              mb: 3,
              background: theme.customStyles?.neonGradient || 'linear-gradient(45deg, #00acca, #00bcca)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'primary.main',
              lineHeight: 1.1,
            }}
          >
            Revolutionizing
            <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
              Urban Parking
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
            }}
          >
            We're transforming how cities handle parking by connecting drivers with available
            spots through an intuitive platform that makes urban mobility efficient, accessible,
            and stress-free for everyone.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: theme.customStyles?.cardGlass?.background ||
                    (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
                  border: theme.customStyles?.cardGlass?.border ||
                    (isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)'),
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  animation: `${fadeInUp} ${0.5 + index * 0.1}s ease-out`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: 'text.primary',
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: 'text.primary',
            }}
          >
            Our Impact in Numbers
          </Typography>

          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    animation: `${fadeInUp} ${0.6 + index * 0.1}s ease-out`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `rgba(${isDarkMode ? '255,255,255' : '0,172,202'}, 0.1)`,
                        color: 'primary.main',
                        width: 60,
                        height: 60,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'primary.main',
                    }}
                  >
                    {stat.value}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.primary',
                    }}
                  >
                    {stat.label}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mission & Vision Section */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ animation: `${fadeInUp} 0.8s ease-out` }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: 'text.primary',
                }}
              >
                Our Mission & Vision
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.7,
                  fontSize: '1.1rem',
                }}
              >
                At ParkVue, we believe that finding parking shouldn't be a stressful experience.
                Our mission is to create smarter cities by optimizing parking space utilization
                through innovative technology.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.7,
                  fontSize: '1.1rem',
                }}
              >
                We envision a future where urban mobility is seamless, efficient, and accessible
                to everyone. By connecting parking space owners with drivers, we're building
                sustainable communities while reducing traffic congestion and carbon emissions.
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                  {missionPoints.map((point, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircle sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {point}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 400,
                  borderRadius: 4,
                  background: theme.customStyles?.neonGradient || 'linear-gradient(45deg, #00acca, #00bcca)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 30% 30%, ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)'
                      } 0%, transparent 70%)`,
                  }}
                />
                <LocalParking sx={{ fontSize: 120, color: 'white', opacity: 0.9 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* About Me Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: 'text.primary',
            }}
          >
            About the Developer
          </Typography>

          <Card
            sx={{
              maxWidth: 800,
              mx: 'auto',
              background: theme.customStyles?.cardGlass?.background ||
                (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'),
              border: theme.customStyles?.cardGlass?.border ||
                (isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)'),
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              overflow: 'hidden',
              animation: `${fadeInUp} 0.8s ease-out`,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar
                      sx={{
                        width: 200,
                        height: 200,
                        border: `4px solid ${theme.palette.primary.main}`,
                      }}
                      src="/dev.png"
                      alt="Developer"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: 'text.primary',
                    }}
                  >
                    Shao Yan
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'primary.main',
                      mb: 3,
                      fontWeight: 600,
                    }}
                  >
                    Full Stack Developer & Founder
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      lineHeight: 1.7,
                    }}
                  >
                    Passionate about building solutions that solve real-world problems.
                    With over 3 years of experience in web development, I created ParkVue
                    to address the growing parking challenges in urban areas and to
                    contribute to smarter, more sustainable cities.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <a href="https://github.com/sskyhigh" target="_blank" rel="noopener noreferrer">
                      <Avatar
                        sx={{
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: 'text.primary',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <GitHub />
                      </Avatar>
                    </a>

                    <a href="https://www.linkedin.com/in/shaoyan8/" target="_blank" rel="noopener noreferrer">
                      <Avatar
                        sx={{
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: 'text.primary',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: '#0077B5',
                            color: 'white',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <LinkedIn />
                      </Avatar>
                    </a>

                    <a href="mailto:shaoyan888@gmail.com">
                      <Avatar
                        sx={{
                          bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: 'text.primary',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: '#EA4335',
                            color: 'white',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <Email />
                      </Avatar>
                    </a>
                  </Box>

                </Grid>
              </Grid>

            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>

  );
}

export default About;