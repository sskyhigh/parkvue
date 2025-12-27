import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Divider,
} from '@mui/material';

const PrivacyPage = () => {
  const theme = useTheme();

  const sectionStyle = {
    mb: 3,
    p: { xs: 2, md: 3 },
    backgroundColor: theme.palette.background.paper,
    borderRadius: 1,
    border: `1px solid ${theme.palette.divider}`,
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 10, md: 12 },
        pb: 8,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Privacy Policy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            How we collect, use, and protect your information on ParkVue.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Updated: December 27, 2025
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            1. Introduction
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            This Privacy Policy explains how ParkVue collects, uses, and protects your personal information when you use our peer-to-peer parking marketplace platform.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            By using ParkVue, you agree to the collection and use of information as described in this policy. We're committed to transparency and protecting your privacy.
          </Typography>
        </Paper>

        {/* Information We Collect */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            2. Information We Collect
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Information You Provide
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 2 }}>
            <li><strong>Account:</strong> Name, email, phone number, password</li>
            <li><strong>Listings:</strong> Parking space details, photos, location, pricing, availability</li>
            <li><strong>Bookings:</strong> Reservation details, dates, times, vehicle information</li>
            <li><strong>Communications:</strong> Messages with other users and support inquiries</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Information Collected Automatically
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 2 }}>
            <li>Device and browser information</li>
            <li>Usage data and interactions with the platform</li>
            <li>Location data when using location features (with your permission)</li>
            <li>Cookies and similar tracking technologies</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Third-Party Information
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Authentication providers (Google for login)</li>
            <li>Payment processors (Stripe for transactions)</li>
          </Box>
        </Paper>

        {/* How We Use Information */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            3. How We Use Your Information
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Create and manage your ParkVue account</li>
            <li>Process parking space bookings and payments</li>
            <li>Enable communication between space owners and renters</li>
            <li>Display listings and user profiles</li>
            <li>Provide customer support</li>
            <li>Improve platform features and user experience</li>
            <li>Prevent fraud and ensure platform security</li>
            <li>Send booking confirmations and important updates</li>
            <li>Comply with legal obligations</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, pl: 3 }}>
            You can opt out of promotional emails at any time through your account settings.
          </Typography>
        </Paper>

        {/* Information Sharing */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            4. How We Share Your Information
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We don't sell your personal information. We share data only when necessary:
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            With Other Users
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            When you book or list a parking space, relevant contact and vehicle information is shared between the space owner and renter to facilitate the booking.
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            With Service Providers
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Stripe for payment processing</li>
            <li>Firebase for authentication and data storage</li>
            <li>Mapbox for mapping services</li>
          </Box>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            For Legal Reasons
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We may disclose information to comply with legal obligations, court orders, or to protect users' safety and platform integrity.
          </Typography>
        </Paper>

        {/* Data Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            5. Data Security
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We implement industry-standard security measures to protect your information:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure payment processing through Stripe</li>
            <li>Firebase authentication and secure data storage</li>
            <li>Regular security monitoring and updates</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            While we take security seriously, no internet transmission is 100% secure. We cannot guarantee absolute security.
          </Typography>
        </Paper>

        {/* Your Rights and Choices */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            6. Your Rights
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update your profile and account information anytime</li>
            <li><strong>Deletion:</strong> Delete your account through account settings</li>
            <li><strong>Marketing:</strong> Opt out of promotional emails via unsubscribe links</li>
            <li><strong>Location:</strong> Control location permissions through device settings</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Contact privacy@parkvue.com to exercise your rights. We'll respond within 30 days.
          </Typography>
        </Paper>

        {/* Cookies */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            7. Cookies
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We use cookies to remember your preferences, keep you logged in, and improve platform performance. You can control cookies through your browser settings, though this may affect functionality.
          </Typography>
        </Paper>

        {/* Data Retention */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            8. Data Retention
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We retain your information as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes. When you delete your account, we'll delete your data within 90 days, except where required by law.
          </Typography>
        </Paper>

        {/* Children's Privacy */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            9. Children's Privacy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ParkVue is not for users under 18. We don't knowingly collect information from children. If we discover we've collected data from a child, we'll delete it promptly.
          </Typography>
        </Paper>

        {/* Changes to Privacy Policy */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            10. Changes to This Policy
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We may update this Privacy Policy as needed. When we make material changes, we'll update the date at the top and notify you via email or platform notification. Continued use after changes means you accept the updated policy.
          </Typography>
        </Paper>

        {/* Contact Us */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            11. Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Questions about this Privacy Policy? Contact us:
          </Typography>
          <Box sx={{ color: theme.palette.text.secondary }}>
            <Typography variant="body2">Email: privacy@parkvue.com</Typography>
            <Typography variant="body2">Support: support@parkvue.com</Typography>
          </Box>
        </Paper>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            By using ParkVue, you acknowledge that you've read and understood this Privacy Policy.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
