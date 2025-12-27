import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  alpha,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Gavel as GavelIcon,
  Shield as ShieldIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  Copyright as CopyrightIcon,
  Cancel as CancelIcon,
  Handshake as HandshakeIcon,
  Edit as EditIcon,
  ContactSupport as ContactSupportIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid';

const TermsPage = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const termsSections = [
    {
      id: 'agreement',
      title: 'Agreement to Terms',
      icon: <HandshakeIcon />,
      content: [
        'By using ParkVue, you agree to these Terms of Service. If you do not agree, please do not use our platform.',
        'ParkVue connects parking space owners with renters in a secure, peer-to-peer marketplace. We facilitate these connections but are not a party to rental agreements.',
        'These terms govern your access to and use of ParkVue services, including our website, mobile applications, and APIs.'
      ],
      tags: ['Registration', 'Acceptance']
    },
    {
      id: 'eligibility',
      title: 'Eligibility',
      icon: <ShieldIcon />,
      content: [
        'You must be at least 18 years old to use ParkVue.',
        'Provide accurate and complete registration information.',
        'Maintain the security of your account credentials.',
        'Not have been previously suspended or removed from the platform.',
        'Comply with all applicable laws in your jurisdiction.'
      ],
      tags: ['Age Requirement', 'Account Security']
    },
    {
      id: 'owner-responsibilities',
      title: 'Owner Responsibilities',
      icon: <CheckCircleIcon />,
      content: [
        'Have legal authority to list and rent the parking space.',
        'Provide accurate, current, and complete listing information.',
        'Maintain the space in safe, clean, and accessible condition.',
        'Comply with all local laws, zoning regulations, and property rules.',
        'Honor confirmed bookings and communicate promptly with renters.',
        'Set clear access instructions and be available for questions.',
        'Maintain appropriate insurance coverage for your property.'
      ],
      tags: ['Legal Authority', 'Property Management']
    },
    {
      id: 'renter-responsibilities',
      title: 'Renter Responsibilities',
      icon: <CheckCircleIcon />,
      content: [
        'Use the space only as described in the listing.',
        'Leave the space in the same condition as you found it.',
        'Comply with all posted rules and owner instructions.',
        'You are liable for any damage caused during your booking.',
        'Park only the vehicle(s) specified in your booking.',
        'Respect the property and neighboring spaces.',
        'Report any issues or damages immediately.'
      ],
      tags: ['Proper Use', 'Damage Liability']
    },
    {
      id: 'bookings-payments',
      title: 'Bookings & Payments',
      icon: <PaymentIcon />,
      content: [
        'Bookings are confirmed upon successful payment processing through Stripe.',
        'Full payment is required at the time of booking.',
        'ParkVue charges a service fee (displayed before confirmation).',
        'Cancellation policies are set by individual owners and vary by listing.',
        'Refunds are processed according to the applicable cancellation policy.',
        'We reserve the right to cancel bookings in cases of suspected fraud.'
      ],
      tags: ['Stripe', 'Cancellation Policy']
    },
    {
      id: 'prohibited',
      title: 'Prohibited Activities',
      icon: <WarningIcon />,
      content: [
        'Violating any laws, regulations, or third-party rights.',
        'Submitting false or misleading information.',
        'Harassing, harming, or intimidating other users.',
        'Circumventing payment systems or service fees.',
        'Creating multiple accounts to manipulate ratings.',
        'Using automated systems, bots, or scrapers.',
        'Storing hazardous materials or engaging in illegal activities.',
        'Commercial use without explicit permission.'
      ],
      tags: ['Zero Tolerance', 'Compliance']
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <GavelIcon />,
      content: [
        'ParkVue is a platform connecting owners and renters - we do not own or control listed spaces.',
        'We are not responsible for the condition, safety, or legality of parking spaces.',
        'Not liable for property damage, theft, or personal injury at parking locations.',
        'Users should obtain appropriate insurance coverage for their needs.',
        'The platform is provided "as is" without warranties of any kind.',
        'Maximum liability is limited to the amount paid for the booking in question.'
      ],
      tags: ['Disclaimer', 'Insurance']
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <CopyrightIcon />,
      content: [
        'All ParkVue platform content is protected by copyright and trademark laws.',
        'By uploading content, you grant us a worldwide, non-exclusive license to use it.',
        'You retain ownership of your content but allow ParkVue to display it on the platform.',
        'Do not infringe on others\' intellectual property rights.',
        'Report copyright infringement through our designated process.'
      ],
      tags: ['Copyright', 'Licensing']
    },
    {
      id: 'account-termination',
      title: 'Account Termination',
      icon: <CancelIcon />,
      content: [
        'We may suspend or terminate accounts for:',
        '• Violation of these Terms of Service',
        '• Fraudulent or harmful activity',
        '• Multiple complaints from other users',
        '• Creating a risk or legal exposure for ParkVue',
        '• Prolonged inactivity (over 24 months)',
        'You may delete your account anytime through account settings.',
        'Termination does not relieve you of outstanding payment obligations.'
      ],
      tags: ['Suspension', 'Account Management']
    },
    {
      id: 'dispute-resolution',
      title: 'Dispute Resolution',
      icon: <HandshakeIcon />,
      content: [
        'Disputes between users should first be resolved directly between parties.',
        'ParkVue may assist in mediation at our discretion.',
        'For unresolved disputes, contact us at disputes@parkvue.com.',
        'Agree to attempt informal resolution for at least 30 days before legal action.',
        'Binding arbitration may be required for certain disputes.',
        'Governing law is based on your location and platform usage.'
      ],
      tags: ['Mediation', 'Arbitration']
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      icon: <EditIcon />,
      content: [
        'We may modify these terms as needed to reflect:',
        '• Changes to our services',
        '• Legal or regulatory requirements',
        '• Security or technical considerations',
        'We will notify users of material changes via email or platform notifications.',
        'Continued use after changes constitutes acceptance of modified terms.',
        'Check this page regularly for updates.',
        'Previous versions are archived and available upon request.'
      ],
      tags: ['Updates', 'Notification']
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: <ContactSupportIcon />,
      content: [
        'For questions about these Terms of Service:',
        'Email: legal@parkvue.com',
        'For general support: support@parkvue.com',
        'For press inquiries: press@parkvue.com',
        'Mailing address: ParkVue Inc., 123 Innovation Drive, Tech City, TC 94107',
        'Response time: 2-3 business days for non-urgent inquiries.',
        'Emergency contact for urgent safety concerns: +1-800-PARKVUE'
      ],
      tags: ['Support', 'Legal Team']
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 8, md: 10 },
        pb: 8,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '400px',
          background: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ 
            mb: 6, 
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              margin: '0 auto 20px',
              border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: theme.shadows[4],
            }}
          >
            <GavelIcon sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Terms of Service
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ 
              mb: 5,
              maxWidth: '600px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Your guide to using ParkVue responsibly and securely
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
            <Chip 
              icon={<CheckCircleIcon />} 
              label="Last Updated: Dec 27, 2025" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<ShieldIcon />} 
              label="Secure Platform" 
              color="success"
              variant="outlined"
            />
            <Chip 
              icon={<PaymentIcon />} 
              label="Stripe Protected" 
              color="info"
              variant="outlined"
            />
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: '700px',
              mx: 'auto',
              px: { xs: 2, md: 0 },
              fontSize: '1.1rem',
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            Welcome to ParkVue! These terms outline the rules and guidelines for using our platform. 
            We're committed to creating a safe, transparent, and efficient marketplace for parking space rentals.
          </Typography>
        </Box>

        {/* Quick Summary Cards */}
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{ mb: 6 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                      <ShieldIcon color="primary" />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Your Safety First
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Secure payments, verified users, and comprehensive insurance options to protect every transaction.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                      <HandshakeIcon color="success" />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Fair Terms
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Transparent cancellation policies, clear expectations, and fair dispute resolution for all users.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4.3,
                    height: '100%',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                      <PaymentIcon color="info" />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Secure Payments
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    All transactions protected by Stripe with encrypted processing and fraud detection.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Main Terms Content */}
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{ mb: 6 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 4,
              color: theme.palette.text.primary,
              textAlign: 'center',
            }}
          >
            Detailed Terms & Conditions
          </Typography>

          {termsSections.map((section, index) => (
            <motion.div key={section.id} variants={itemVariants} style={{ marginBottom: '24px' }}>
              <Accordion
                expanded={expanded === section.id}
                onChange={handleAccordionChange(section.id)}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  mb: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:before': { display: 'none' },
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: expanded === section.id 
                      ? alpha(theme.palette.primary.main, 0.05)
                      : 'transparent',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    minHeight: '72px',
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: expanded === section.id 
                        ? theme.palette.primary.main 
                        : alpha(theme.palette.primary.main, 0.1),
                      color: expanded === section.id ? 'white' : theme.palette.primary.main,
                    }}
                  >
                    {section.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {section.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      {section.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    p: 3,
                  }}
                >
                  <Stack spacing={2}>
                    {section.content.map((paragraph, idx) => (
                      <Typography
                        key={idx}
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.7,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                        }}
                      >
                        {paragraph.startsWith('•') ? (
                          <>
                            <Box component="span" sx={{ color: theme.palette.primary.main, mt: '2px' }}>•</Box>
                            {paragraph.substring(1)}
                          </>
                        ) : (
                          paragraph
                        )}
                      </Typography>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>

        {/* Final Acceptance Section */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              margin: '0 auto 24px',
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Your Agreement
          </Typography>
          
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
              fontSize: '1.1rem',
              lineHeight: 1.7,
            }}
          >
            By continuing to use ParkVue, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms of Service.
          </Typography>

          <Divider sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.3) }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleIcon />}
              sx={{ borderRadius: 2, px: 4 }}
              onClick={() => window.history.back()}
            >
              I Understand & Accept
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ContactSupportIcon />}
              href="mailto:legal@parkvue.com"
              sx={{ borderRadius: 2, px: 4 }}
            >
              Ask Questions
            </Button>
          </Stack>
        </Paper>

        {/* Footer Note */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            mt: 4,
            px: 2,
            fontStyle: 'italic',
          }}
        >
          These terms are effective as of December 27, 2025. We recommend reviewing this page periodically for updates.
        </Typography>
      </Container>
    </Box>
  );
};

export default TermsPage;