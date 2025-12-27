import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Gavel,
  Description,
  AccountBalance,
  VerifiedUser,
} from '@mui/icons-material';

const TermsPage = () => {
  const theme = useTheme();

  const sectionStyle = {
    mb: 4,
    p: 3,
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(10px)',
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  };

  const iconStyle = {
    color: theme.palette.primary.main,
    mr: 1,
    verticalAlign: 'middle',
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 8,
        pb: 6,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(180deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
          : `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Gavel sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Terms of Service
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Please read these terms carefully before using ParkVue
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Last Updated: December 27, 2025
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Description sx={iconStyle} />
            1. Agreement to Terms
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to ParkVue. By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ParkVue is a peer-to-peer marketplace that connects parking space owners ("Hosts") with individuals seeking parking ("Guests"). We facilitate these connections but are not a party to the agreements between Hosts and Guests.
          </Typography>
        </Paper>

        {/* Eligibility */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <VerifiedUser sx={iconStyle} />
            2. Eligibility
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            To use ParkVue, you must:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Be at least 18 years of age</li>
            <li>Have the legal capacity to enter into binding contracts</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Not have been previously banned from the platform</li>
          </Box>
        </Paper>

        {/* User Responsibilities */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            3. User Responsibilities
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
            For Hosts (Parking Space Owners):
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>You must have legal authority to list and rent the parking space</li>
            <li>All listing information must be accurate, current, and complete</li>
            <li>You must maintain the parking space in safe and accessible condition</li>
            <li>You are responsible for complying with all local laws, regulations, and HOA rules</li>
            <li>You must honor confirmed bookings unless extraordinary circumstances arise</li>
            <li>You may not discriminate against Guests based on protected characteristics</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
            For Guests (Parking Space Renters):
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>You must use the parking space only as described in the listing</li>
            <li>You are responsible for the conduct of all occupants of your vehicle</li>
            <li>You must leave the parking space in the same condition as you found it</li>
            <li>You must comply with all posted rules and Host instructions</li>
            <li>You are liable for any damage caused to the parking space or surrounding property</li>
            <li>You must park only the vehicle(s) specified in your booking</li>
          </Box>
        </Paper>

        {/* Booking and Payments */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <AccountBalance sx={iconStyle} />
            4. Booking and Payment Terms
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
            Booking Process:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Bookings are confirmed when payment is successfully processed</li>
            <li>You will receive a confirmation email with booking details</li>
            <li>Changes or cancellations are subject to the Host's cancellation policy</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
            Payment Processing:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>All payments are processed securely through our payment partners</li>
            <li>Guests are charged at the time of booking</li>
            <li>Hosts receive payment after the booking period ends, minus service fees</li>
            <li>ParkVue charges a service fee for facilitating transactions</li>
            <li>All fees are clearly displayed before booking confirmation</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
            Cancellations and Refunds:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Cancellation policies vary by listing and are set by Hosts</li>
            <li>Refunds are processed according to the applicable cancellation policy</li>
            <li>Service fees may be non-refundable</li>
            <li>ParkVue reserves the right to cancel bookings in cases of suspected fraud or policy violations</li>
          </Box>
        </Paper>

        {/* Prohibited Activities */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            5. Prohibited Activities
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Users may not:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Violate any local, state, national, or international law</li>
            <li>Infringe on intellectual property rights</li>
            <li>Submit false, misleading, or fraudulent information</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Use the platform for commercial activities not related to parking</li>
            <li>Attempt to circumvent payment systems or service fees</li>
            <li>Create multiple accounts to manipulate ratings or reviews</li>
            <li>Use automated systems or bots to access the platform</li>
            <li>Store hazardous materials or engage in illegal activities on listed properties</li>
          </Box>
        </Paper>

        {/* Liability and Disclaimers */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ParkVue acts solely as an intermediary platform. We do not own, operate, or control parking spaces listed on our platform.
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>ParkVue is not responsible for the condition, safety, or legality of any parking space</li>
            <li>We are not liable for any property damage, theft, or personal injury occurring at parking locations</li>
            <li>Hosts and Guests enter into agreements directly with each other</li>
            <li>Users are responsible for obtaining appropriate insurance coverage</li>
            <li>ParkVue's total liability shall not exceed the fees paid for the specific booking in question</li>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
          </Typography>
        </Paper>

        {/* Intellectual Property */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            7. Intellectual Property
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            All content on ParkVue, including text, graphics, logos, images, and software, is the property of ParkVue or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            By uploading content to ParkVue, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with the platform.
          </Typography>
        </Paper>

        {/* Account Termination */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            8. Account Termination
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ParkVue reserves the right to suspend or terminate your account at any time for:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Violation of these Terms of Service</li>
            <li>Fraudulent, illegal, or harmful activity</li>
            <li>Multiple complaints from other users</li>
            <li>Extended period of inactivity</li>
            <li>At our sole discretion for any other reason</li>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            You may terminate your account at any time through your account settings. Upon termination, you remain liable for all outstanding obligations.
          </Typography>
        </Paper>

        {/* Dispute Resolution */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            9. Dispute Resolution
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Disputes between Hosts and Guests should first be resolved directly between the parties. If resolution cannot be reached, ParkVue may, at its discretion, assist in mediating the dispute.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Any claims against ParkVue must first go through good faith negotiation. If unresolved after 30 days, disputes will be resolved through binding arbitration in accordance with applicable laws.
          </Typography>
        </Paper>

        {/* Changes to Terms */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            10. Modifications to Terms
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ParkVue reserves the right to modify these Terms of Service at any time. We will notify users of material changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the modified terms.
          </Typography>
        </Paper>

        {/* Contact Information */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            11. Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            If you have questions about these Terms of Service, please contact us:
          </Typography>
          <Box sx={{ color: theme.palette.text.secondary }}>
            <Typography variant="body1">Email: legal@parkvue.com</Typography>
            <Typography variant="body1">Support: support@parkvue.com</Typography>
          </Box>
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* Footer Note */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            By using ParkVue, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsPage;
