import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  alpha,
  Chip,
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
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

const TermsPage = () => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('agreement');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const scrollContainer = document.getElementById('scrollable-content');

      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const offsetPosition = (elementRect.top - containerRect.top) + scrollContainer.scrollTop - offset;
        scrollContainer.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        return;
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
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

  const sectionStyle = {
    mb: 3,
    p: { xs: 2, md: 3 },
    backgroundColor: theme.palette.background.paper,
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: alpha(theme.palette.primary.main, 0.3),
      boxShadow: theme.shadows[4],
    },
  };

  useEffect(() => {
    const offset = 110;
    const sectionIds = termsSections.map((s) => s.id);
    const scrollContainer = document.getElementById('scrollable-content');

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            if (b.intersectionRatio !== a.intersectionRatio) {
              return b.intersectionRatio - a.intersectionRatio;
            }
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

        if (visible.length > 0) {
          const id = visible[0].target?.id;
          if (id) setActiveSection(id);
        }
      },
      {
        root: scrollContainer || null,
        rootMargin: `-${offset}px 0px -70% 0px`,
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [termsSections]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 10, md: 12 },
        pb: 8,
        backgroundColor: theme.palette.background.default,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
          {/* Sticky Index on the Left */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              display: { xs: 'none', lg: 'block' },
              width: 280,
              position: 'sticky',
              top: 100,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                background: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 700, color: theme.palette.text.secondary }}>
                TABLE OF CONTENTS
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense sx={{ py: 0 }}>
                {termsSections.map((section) => (
                  <ListItem key={section.id} disablePadding>
                    <ListItemButton
                      onClick={() => scrollToSection(section.id)}
                      selected={activeSection === section.id}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                          },
                        },
                      }}
                    >
                      <Box sx={{ mr: 1.5, color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                        {section.icon}
                      </Box>
                      <ListItemText
                        primary={section.title}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: activeSection === section.id ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Header */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              sx={{ mb: 6, textAlign: 'center' }}
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
                  color: theme.palette.text.primary,
                }}
              >
                Terms of Service
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: '700px', mx: 'auto', fontWeight: 400 }}>
                Your guide to using ParkVue responsibly and securely
              </Typography>

              <Chip
                icon={<CheckCircleIcon />}
                label="Last Updated: December 27, 2025"
                color="primary"
                variant="outlined"
              />
            </Box>

            {termsSections.map((section) => (
              <Paper key={section.id} id={section.id} sx={sectionStyle}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }}
                  >
                    {section.icon}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {section.title}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.75 }}>
                      {section.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                      ))}
                    </Stack>
                  </Box>
                </Stack>

                <Stack spacing={1}>
                  {section.content.map((line, idx) => {
                    const normalized = line.startsWith('•') ? line.substring(1).trimStart() : line;
                    return (
                      <Typography key={idx} variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {normalized}
                      </Typography>
                    );
                  })}
                </Stack>
              </Paper>
            ))}

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                These terms are effective as of December 27, 2025. We recommend reviewing this page periodically for updates.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsPage;