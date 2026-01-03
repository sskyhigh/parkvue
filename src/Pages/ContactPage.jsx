import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
  alpha,
  Avatar,
  Divider,
  keyframes,
} from '@mui/material';
import {
  LinkedIn,
  Email,
  LocationOn,
  Schedule,
  MonetizationOn,
  Security,
} from '@mui/icons-material';
import { useForm, ValidationError } from '@formspree/react';
import { useValue } from '../context/ContextProvider';
import logo from '../img/parkvue_logo.png';

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

const ContactPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { dispatch } = useValue();
  const [state, formspreeHandleSubmit] = useForm('xjgkoope');

  const requestTypeOptions = useMemo(
    () => [
      { value: 'general', label: 'General Inquiry' },
      { value: 'parking-owner', label: 'List My Parking Space' },
      { value: 'support', label: 'Technical Support' },
      { value: 'partnerships', label: 'Partnership Opportunities' },
      { value: 'business', label: 'Business Solutions' },
    ],
    []
  );

  const countryOptions = useMemo(
    () => [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'au', label: 'Australia' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
      { value: 'other', label: 'Other' },
    ],
    []
  );

  const [form, setForm] = useState({
    requestType: '',
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    companyName: '',
    country: '',
    description: '',
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    if (!form.requestType) {
      return 'Please select how we can help you';
    }

    if (!form.firstName.trim()) {
      return 'First name is required';
    }

    if (!form.lastName.trim()) {
      return 'Last name is required';
    }

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      return 'Please enter a valid email address';
    }

    if (!form.country) {
      return 'Please select your country';
    }

    if (!form.description.trim()) {
      return 'Please describe your request';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    const validationError = validateForm();
    if (validationError) {
      event.preventDefault();
      dispatch({
        type: 'UPDATE_ALERT',
        payload: { open: true, severity: 'error', message: validationError },
      });
      return;
    }

    await formspreeHandleSubmit(event);

    if (state.errors && state.errors.length > 0) {
      dispatch({
        type: 'UPDATE_ALERT',
        payload: { open: true, severity: 'error', message: 'Submission failed. Please try again.' },
      });
    }
  };

  useEffect(() => {
    if (!state.succeeded) return;

    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'success',
        message: "Thanks! We received your message and will get back to you soon.",
      },
    });

    setForm({
      requestType: '',
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      companyName: '',
      country: '',
      description: '',
    });
  }, [dispatch, state.succeeded]);

  const highlights = [
    {
      icon: <LocationOn sx={{ fontSize: 28 }} />,
      text: 'Find & reserve parking spots instantly',
    },
    {
      icon: <Schedule sx={{ fontSize: 28 }} />,
      text: 'Flexible booking - hourly, daily, or monthly',
    },
    {
      icon: <MonetizationOn sx={{ fontSize: 28 }} />,
      text: 'Earn passive income by listing your space',
    },
    {
      icon: <Security sx={{ fontSize: 28 }} />,
      text: 'Secure payments & verified users',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 10, md: 12 },
        pb: 8,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' },
            gap: { xs: 4, md: 6 },
            alignItems: 'start',
          }}
        >
          {/* Left Side */}
          <Box
            component="div"
            sx={{
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          >
            {/* Logo */}
            <Box sx={{ mb: 4 }}>
              <img
                src={logo}
                alt="Parkvue Logo"
                style={{
                  width: '180px',
                  height: 'auto',
                }}
              />
            </Box>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: theme.customStyles?.neonGradient || 'linear-gradient(45deg, #00acca, #00bcca)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'primary.main',
              }}
            >
              Get in Touch
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1.1rem',
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              Have questions about Parkvue? Whether you're looking to find parking, list your space, or explore partnership opportunities, we're here to help.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: theme.palette.text.primary,
              }}
            >
              Why Choose Parkvue?
            </Typography>

            <Box sx={{ mb: 4 }}>
              {highlights.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2.5,
                    p: 2,
                    borderRadius: 2,
                    background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 172, 202, 0.03)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 172, 202, 0.08)',
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      mr: 2,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              Connect With Us
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

              <a href="mailto:slow160boys@gmail.com">
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
          </Box>

          {/* Right Side - Contact Form */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: theme.customStyles?.cardGlass?.background ||
                (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'),
              border: theme.customStyles?.cardGlass?.border ||
                (isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)'),
              backdropFilter: 'blur(10px)',
              animation: `${fadeInUp} 0.7s ease-out`,
              boxShadow: theme.shadows[8],
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: theme.palette.text.primary,
              }}
            >
              Send us a message
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2.5 }}>
              <input type="hidden" name="_subject" value="Parkvue Contact Request" />
              <FormControl fullWidth>
                <InputLabel shrink id="contact-request-type-label">How can we help you? *</InputLabel>
                <Select
                  labelId="contact-request-type-label"
                  name="requestType"
                  value={form.requestType}
                  label="How can we help you? *"
                  onChange={handleChange('requestType')}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) return 'Select...';
                    return requestTypeOptions.find((o) => o.value === selected)?.label ?? 'Select...';
                  }}
                >
                  <MenuItem value="">
                    <em>Select...</em>
                  </MenuItem>
                  {requestTypeOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <ValidationError prefix="Request type" field="requestType" errors={state.errors} />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2.5,
                }}
              >
                <TextField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  fullWidth
                  required
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  fullWidth
                  required
                />
              </Box>

              <TextField
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange('email')}
                fullWidth
                required
                type="email"
              />

              <ValidationError prefix="Email" field="email" errors={state.errors} />

              <TextField
                label="Job Title"
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange('jobTitle')}
                fullWidth
              />

              <TextField
                label="Company Name"
                name="companyName"
                value={form.companyName}
                onChange={handleChange('companyName')}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel shrink id="contact-country-label">Country *</InputLabel>
                <Select
                  labelId="contact-country-label"
                  name="country"
                  value={form.country}
                  label="Country *"
                  onChange={handleChange('country')}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) return 'Select...';
                    return countryOptions.find((o) => o.value === selected)?.label ?? 'Select...';
                  }}
                >
                  <MenuItem value="">
                    <em>Select...</em>
                  </MenuItem>
                  {countryOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <ValidationError prefix="Country" field="country" errors={state.errors} />

              <TextField
                label="Describe your request"
                name="description"
                value={form.description}
                onChange={handleChange('description')}
                fullWidth
                required
                multiline
                minRows={4}
                placeholder="Tell us more about how we can help you..."
              />

              <ValidationError prefix="Message" field="description" errors={state.errors} />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={state.submitting}
                endIcon={state.submitting ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                {state.submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
