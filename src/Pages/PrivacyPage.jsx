import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Divider,
  Stack,
  Chip,
  Avatar,
  alpha,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Share as ShareIcon,
  Shield as ShieldIcon,
  Person as PersonIcon,
  Cookie as CookieIcon,
  Storage as StorageIcon,
  ChildCare as ChildCareIcon,
  Update as UpdateIcon,
  ContactSupport as ContactSupportIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('introduction');

  const privacySections = useMemo(() => [
    { id: 'introduction', title: '1. Introduction', icon: <InfoIcon /> },
    { id: 'information-collect', title: '2. Information We Collect', icon: <StorageIcon /> },
    { id: 'use-information', title: '3. How We Use Your Information', icon: <SecurityIcon /> },
    { id: 'share-information', title: '4. How We Share Your Information', icon: <ShareIcon /> },
    { id: 'data-security', title: '5. Data Security', icon: <LockIcon /> },
    { id: 'your-rights', title: '6. Your Rights', icon: <PersonIcon /> },
    { id: 'cookies', title: '7. Cookies', icon: <CookieIcon /> },
    { id: 'data-retention', title: '8. Data Retention', icon: <StorageIcon /> },
    { id: 'children-privacy', title: '9. Children\'s Privacy', icon: <ChildCareIcon /> },
    { id: 'changes', title: '10. Changes to This Policy', icon: <UpdateIcon /> },
    { id: 'contact', title: '11. Contact Us', icon: <ContactSupportIcon /> },
  ], []);

  const sectionIconById = useMemo(
    () => Object.fromEntries(privacySections.map((section) => [section.id, section.icon])),
    [privacySections]
  );

  useEffect(() => {
    const offset = 120;
    const scrollContainer = document.getElementById('scrollable-content');
    const sectionIds = privacySections.map((s) => s.id);
    let rafId = null;

    const isAtBottom = () => {
      const lastId = sectionIds[sectionIds.length - 1];
      if (!lastId) return null;

      if (scrollContainer) {
        const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 4;
        return atBottom ? lastId : null;
      }

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      return atBottom ? lastId : null;
    };

    const computeActive = () => {
      const bottomId = isAtBottom();
      if (bottomId) {
        setActiveSection(bottomId);
        return;
      }

      const currentScrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      const containerRect = scrollContainer ? scrollContainer.getBoundingClientRect() : { top: 0 };
      const targetY = currentScrollTop + offset;

      let bestId = sectionIds[0] || 'introduction';
      let bestTop = -Infinity;

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const topInScroll = scrollContainer
          ? (rect.top - containerRect.top) + currentScrollTop
          : rect.top + window.scrollY;

        if (topInScroll <= targetY && topInScroll > bestTop) {
          bestTop = topInScroll;
          bestId = id;
        }
      });

      setActiveSection(bestId);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        computeActive();
      });
    };

    const scrollTarget = scrollContainer || window;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    computeActive();

    return () => {
      scrollTarget.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [privacySections]);

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

  const sectionStyle = {
    mb: 3,
    p: { xs: 2.5, md: 3 },
    scrollMarginTop: 120,
    backgroundColor: theme.palette.background.paper,
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: alpha(theme.palette.primary.main, 0.3),
      boxShadow: theme.shadows[4],
    }
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
      <Container maxWidth="lg">
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
                {privacySections.map((section) => (
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
                <ShieldIcon sx={{ fontSize: 40 }} />
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
                Privacy Policy
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: '600px', mx: 'auto', fontWeight: 400 }}>
                How we collect, use, and protect your information on ParkVue
              </Typography>

              <Chip
                icon={<UpdateIcon />}
                label="Last Updated: December 27, 2025"
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* Introduction */}
            <Paper id="introduction" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById.introduction}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  1. Introduction
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                This Privacy Policy explains how ParkVue collects, uses, and protects your personal information when you use our peer-to-peer parking marketplace platform.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                By using ParkVue, you agree to the collection and use of information as described in this policy. We're committed to transparency and protecting your privacy.
              </Typography>
            </Paper>

            {/* Information We Collect */}
            <Paper id="information-collect" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['information-collect']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  2. Information We Collect
                </Typography>
              </Stack>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Information You Provide
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  <strong>Account:</strong> Name, email, phone number, password
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  <strong>Listings:</strong> Parking space details, photos, location, pricing, availability
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  <strong>Bookings:</strong> Reservation details, dates, times, vehicle information
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  <strong>Communications:</strong> Messages with other users and support inquiries
                </Typography>
              </Stack>

              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Information Collected Automatically
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Device and browser information
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Usage data and interactions with the platform
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Location data when using location features (with your permission)
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Cookies and similar tracking technologies
                </Typography>
              </Stack>

              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Third-Party Information
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Authentication providers (Google for login)
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Payment processors (Stripe for transactions)
                </Typography>
              </Stack>
            </Paper>

            {/* How We Use Information */}
            <Paper id="use-information" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['use-information']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  3. How We Use Your Information
                </Typography>
              </Stack>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Create and manage your ParkVue account</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Process parking space bookings and payments</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Enable communication between space owners and renters</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Display listings and user profiles</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Provide customer support</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Improve platform features and user experience</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Prevent fraud and ensure platform security</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Send booking confirmations and important updates</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Comply with legal obligations</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                You can opt out of promotional emails at any time through your account settings.
              </Typography>
            </Paper>

            {/* Information Sharing */}
            <Paper id="share-information" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['share-information']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  4. How We Share Your Information
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                We don't sell your personal information. We share data only when necessary:
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1.5, fontWeight: 600 }}>
                With Other Users
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                When you book or list a parking space, relevant contact and vehicle information is shared between the space owner and renter to facilitate the booking.
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 1.5, fontWeight: 600 }}>
                With Service Providers
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Stripe for payment processing</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Firebase for authentication and data storage</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Mapbox for mapping services</Typography>
              </Stack>

              <Typography variant="h6" sx={{ mt: 3, mb: 1.5, fontWeight: 600 }}>
                For Legal Reasons
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                We may disclose information to comply with legal obligations, court orders, or to protect users' safety and platform integrity.
              </Typography>
            </Paper>

            {/* Data Security */}
            <Paper id="data-security" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['data-security']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  5. Data Security
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                We implement industry-standard security measures to protect your information:
              </Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>SSL/TLS encryption for data transmission</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Secure payment processing through Stripe</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Firebase authentication and secure data storage</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Regular security monitoring and updates</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                While we take security seriously, no internet transmission is 100% secure. We cannot guarantee absolute security.
              </Typography>
            </Paper>

            {/* Your Rights and Choices */}
            <Paper id="your-rights" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['your-rights']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  6. Your Rights
                </Typography>
              </Stack>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}><strong>Access:</strong> Request a copy of your personal information</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}><strong>Correction:</strong> Update your profile and account information anytime</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}><strong>Deletion:</strong> Delete your account through account settings</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}><strong>Marketing:</strong> Opt out of promotional emails via unsubscribe links</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}><strong>Location:</strong> Control location permissions through device settings</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Contact privacy@parkvue.com to exercise your rights. We'll respond within 30 days.
              </Typography>
            </Paper>

            {/* Cookies */}
            <Paper id="cookies" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById.cookies}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  7. Cookies
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                We use cookies to remember your preferences, keep you logged in, and improve platform performance. You can control cookies through your browser settings, though this may affect functionality.
              </Typography>
            </Paper>

            {/* Data Retention */}
            <Paper id="data-retention" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['data-retention']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  8. Data Retention
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                We retain your information as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes. When you delete your account, we'll delete your data within 90 days, except where required by law.
              </Typography>
            </Paper>

            {/* Children's Privacy */}
            <Paper id="children-privacy" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['children-privacy']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  9. Children's Privacy
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                ParkVue is not for users under 18. We don't knowingly collect information from children. If we discover we've collected data from a child, we'll delete it promptly.
              </Typography>
            </Paper>

            {/* Changes to Privacy Policy */}
            <Paper id="changes" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById.changes}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  10. Changes to This Policy
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                We may update this Privacy Policy as needed. When we make material changes, we'll update the date at the top and notify you via email or platform notification. Continued use after changes means you accept the updated policy.
              </Typography>
            </Paper>

            {/* Contact Us */}
            <Paper id="contact" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById.contact}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  11. Contact Us
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                Questions about this Privacy Policy? Contact us:
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Email: privacy@parkvue.com</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Support: support@parkvue.com</Typography>
              </Stack>
            </Paper>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                By using ParkVue, you acknowledge that you've read and understood this Privacy Policy.
              </Typography>
            </Box>

            {/* Extra space so the last section can become active */}
            <Box sx={{ height: { xs: 200, md: 260 } }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
