import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Divider,
} from '@mui/material';

const SecurityPage = () => {
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
            Security
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            How we protect your data and ensure platform safety.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Updated: December 27, 2025
          </Typography>
        </Box>

        {/* Our Commitment */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Our Commitment
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Security is fundamental to ParkVue. We implement industry-standard protections to keep your data safe and maintain a trustworthy parking marketplace.
          </Typography>
        </Paper>

        {/* Data Protection */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Data Protection
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Encryption
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 2 }}>
            <li>SSL/TLS encryption for all data transmission</li>
            <li>Secure data storage through Firebase</li>
            <li>Encrypted payment processing via Stripe</li>
          </Box>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Access Controls
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Role-based access limits who can view data</li>
            <li>Multi-factor authentication for secure access</li>
            <li>Regular security audits and monitoring</li>
          </Box>
        </Paper>

        {/* Payment Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Payment Security
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            All payments are processed through Stripe, a PCI-compliant payment processor. Your credit card details are never stored on our servers.
          </Typography>

          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Real-time fraud detection and monitoring</li>
            <li>Secure tokenization of payment information</li>
            <li>3D Secure authentication when available</li>
          </Box>
        </Paper>

        {/* Account Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Account Security
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Password Protection
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 2 }}>
            <li>Passwords are securely hashed and never stored in plain text</li>
            <li>Account lockout after multiple failed login attempts</li>
            <li>Secure password reset with email verification</li>
          </Box>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Login Security
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Google OAuth integration for secure authentication</li>
            <li>Email notifications for new device logins</li>
            <li>Session management and automatic timeout</li>
          </Box>
        </Paper>

        {/* User Verification */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            User Verification
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            We verify users to maintain platform trust and safety:
          </Typography>

          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Email and phone verification for all accounts</li>
            <li>Google account linking for additional validation</li>
            <li>Review system limited to verified bookings</li>
            <li>Manual review of flagged listings or accounts</li>
          </Box>
        </Paper>

        {/* Platform Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Platform Security
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Infrastructure
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3, mb: 2 }}>
            <li>Hosted on secure Firebase infrastructure</li>
            <li>Automated backups with encryption</li>
            <li>Regular security updates and patches</li>
            <li>DDoS protection and intrusion detection</li>
          </Box>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
            Application Security
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Input validation to prevent injection attacks</li>
            <li>Protection against XSS and CSRF attacks</li>
            <li>API rate limiting to prevent abuse</li>
            <li>Regular code security reviews</li>
          </Box>
        </Paper>

        {/* Safety Features */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Safety Features
          </Typography>
          
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>In-platform messaging keeps communication secure and documented</li>
            <li>Report system for problematic users or listings</li>
            <li>GPS verification for parking location accuracy</li>
            <li>Photo documentation of parking spaces</li>
            <li>AI-powered chatbot for instant support</li>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
            Safety Tip: Always complete payments through ParkVue's secure system. Never share personal payment information outside the platform.
          </Typography>
        </Paper>

        {/* Reporting Issues */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Report Security Concerns
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            If you discover a security vulnerability or have concerns:
          </Typography>

          <Box sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            <Typography variant="body2">Security issues: security@parkvue.com</Typography>
            <Typography variant="body2">Suspicious activity: Use the in-app report feature</Typography>
            <Typography variant="body2">Support: Contact our AI chatbot or support@parkvue.com</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            For immediate danger, contact local law enforcement first.
          </Typography>
        </Paper>

        {/* Your Role */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Your Role in Security
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Help protect your account:
          </Typography>

          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Use a strong, unique password</li>
            <li>Never share your login credentials</li>
            <li>Be cautious of phishing emails</li>
            <li>Log out from shared devices</li>
            <li>Review your account activity regularly</li>
            <li>Report suspicious activity immediately</li>
          </Box>

          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 152, 0, 0.1)' 
              : 'rgba(255, 152, 0, 0.05)',
            borderLeft: `4px solid ${theme.palette.warning.main}`,
            borderRadius: 1
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Important: ParkVue will never ask for your password via email, phone, or text. If someone requests your credentials, it's a scam—report it immediately.
            </Typography>
          </Box>
        </Paper>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Security is an ongoing commitment. We continuously update our measures to protect against emerging threats.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SecurityPage;
