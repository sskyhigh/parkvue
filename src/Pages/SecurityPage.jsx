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
  Payment as PaymentIcon,
  AccountCircle as AccountCircleIcon,
  VerifiedUser as VerifiedUserIcon,
  CloudDone as CloudDoneIcon,
  Report as ReportIcon,
  PersonPin as PersonPinIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { motion } from 'framer-motion';

const SecurityPage = () => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState('commitment');

  const securitySections = useMemo(() => [
    { id: 'commitment', title: 'Our Commitment', icon: <SecurityIcon /> },
    { id: 'data-protection', title: 'Data Protection', icon: <LockIcon /> },
    { id: 'payment-security', title: 'Payment Security', icon: <PaymentIcon /> },
    { id: 'account-security', title: 'Account Security', icon: <AccountCircleIcon /> },
    { id: 'user-verification', title: 'User Verification', icon: <VerifiedUserIcon /> },
    { id: 'platform-security', title: 'Platform Security', icon: <CloudDoneIcon /> },
    { id: 'safety-features', title: 'Safety Features', icon: <HealthAndSafetyIcon /> },
    { id: 'report-concerns', title: 'Report Security Concerns', icon: <ReportIcon /> },
    { id: 'your-role', title: 'Your Role in Security', icon: <PersonPinIcon /> },
  ], []);

  const sectionIconById = useMemo(
    () => Object.fromEntries(securitySections.map((section) => [section.id, section.icon])),
    [securitySections]
  );

  useEffect(() => {
    const offset = 120;
    const scrollContainer = document.getElementById('scrollable-content');
    const sectionIds = securitySections.map((s) => s.id);
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

      let bestId = sectionIds[0] || 'commitment';
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
  }, [securitySections]);

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
                {securitySections.map((section) => (
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
                <LockIcon sx={{ fontSize: 40 }} />
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
                Security
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: '600px', mx: 'auto', fontWeight: 400 }}>
                How we protect your data and ensure platform safety
              </Typography>

              <Chip
                icon={<UpdateIcon />}
                label="Last Updated: December 27, 2025"
                color="primary"
                variant="outlined"
              />
            </Box>

            {/* Our Commitment */}
            <Paper id="commitment" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById.commitment}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Our Commitment
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                Security is fundamental to ParkVue. We implement industry-standard protections to keep your data safe and maintain a trustworthy parking marketplace.
              </Typography>
            </Paper>

            {/* Data Protection */}
            <Paper id="data-protection" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['data-protection']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Data Protection
                </Typography>
              </Stack>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Encryption
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>SSL/TLS encryption for all data transmission</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Secure data storage through Firebase</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Encrypted payment processing via Stripe</Typography>
              </Stack>

              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Access Controls
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Role-based access limits who can view data</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Multi-factor authentication for secure access</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Regular security audits and monitoring</Typography>
              </Stack>
            </Paper>

            {/* Payment Security */}
            <Paper id="payment-security" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['payment-security']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Payment Security
                </Typography>
              </Stack>
              
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                All payments are processed through Stripe, a PCI-compliant payment processor. Your credit card details are never stored on our servers.
              </Typography>

              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Real-time fraud detection and monitoring</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Secure tokenization of payment information</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>3D Secure authentication when available</Typography>
              </Stack>
            </Paper>

            {/* Account Security */}
            <Paper id="account-security" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['account-security']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Account Security
                </Typography>
              </Stack>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Password Protection
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Passwords are securely hashed and never stored in plain text</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Account lockout after multiple failed login attempts</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Secure password reset with email verification</Typography>
              </Stack>

              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Login Security
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Google OAuth integration for secure authentication</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Email notifications for new device logins</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Session management and automatic timeout</Typography>
              </Stack>
            </Paper>

            {/* User Verification */}
            <Paper id="user-verification" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['user-verification']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  User Verification
                </Typography>
              </Stack>
              
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                We verify users to maintain platform trust and safety:
              </Typography>

              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Email and phone verification for all accounts</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Google account linking for additional validation</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Review system limited to verified bookings</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Manual review of flagged listings or accounts</Typography>
              </Stack>
            </Paper>

            {/* Platform Security */}
            <Paper id="platform-security" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['platform-security']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Platform Security
                </Typography>
              </Stack>
              
              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Infrastructure
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Hosted on secure Firebase infrastructure</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Automated backups with encryption</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Regular security updates and patches</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>DDoS protection and intrusion detection</Typography>
              </Stack>

              <Typography variant="h6" sx={{ mt: 2, mb: 1.5, fontWeight: 600 }}>
                Application Security
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Input validation to prevent injection attacks</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Protection against XSS and CSRF attacks</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>API rate limiting to prevent abuse</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Regular code security reviews</Typography>
              </Stack>
            </Paper>

            {/* Safety Features */}
            <Paper id="safety-features" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['safety-features']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Safety Features
                </Typography>
              </Stack>
              
              <Stack spacing={1} sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>In-platform messaging keeps communication secure and documented</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Report system for problematic users or listings</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>GPS verification for parking location accuracy</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Photo documentation of parking spaces</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>AI-powered chatbot for instant support</Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
                Safety Tip: Always complete payments through ParkVue's secure system. Never share personal payment information outside the platform.
              </Typography>
            </Paper>

            {/* Reporting Issues */}
            <Paper id="report-concerns" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['report-concerns']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Report Security Concerns
                </Typography>
              </Stack>
              
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                If you discover a security vulnerability or have concerns:
              </Typography>

              <Stack spacing={0.5} sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Security issues: security@parkvue.com</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Suspicious activity: Use the in-app report feature</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Support: Contact our AI chatbot or support@parkvue.com</Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                For immediate danger, contact local law enforcement first.
              </Typography>
            </Paper>

            {/* Your Role */}
            <Paper id="your-role" sx={sectionStyle}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
                  {sectionIconById['your-role']}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Your Role in Security
                </Typography>
              </Stack>
              
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                Help protect your account:
              </Typography>

              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Use a strong, unique password</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Never share your login credentials</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Be cautious of phishing emails</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Log out from shared devices</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Review your account activity regularly</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>Report suspicious activity immediately</Typography>
              </Stack>

              <Box sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 152, 0, 0.1)' 
                  : 'rgba(255, 152, 0, 0.05)',
                borderLeft: `4px solid ${theme.palette.warning.main}`,
                borderRadius: 1
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.7 }}>
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

            {/* Extra space so the last section can become active */}
            <Box sx={{ height: { xs: 200, md: 260 } }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SecurityPage;
