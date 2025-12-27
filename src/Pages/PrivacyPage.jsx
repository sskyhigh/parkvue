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
  Security,
  Lock,
  Visibility,
  Cookie,
  ContactSupport,
  Shield,
} from '@mui/icons-material';

const PrivacyPage = () => {
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
          <Shield sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
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
            Privacy Policy
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Last Updated: December 27, 2025
          </Typography>
        </Box>

        {/* Introduction */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Security sx={iconStyle} />
            1. Introduction
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to ParkVue's Privacy Policy. This policy describes how ParkVue ("we," "us," or "our") collects, uses, shares, and protects your personal information when you use our parking marketplace platform.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We are committed to protecting your privacy and being transparent about our data practices. By using ParkVue, you consent to the data practices described in this policy.
          </Typography>
        </Paper>

        {/* Information We Collect */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Visibility sx={iconStyle} />
            2. Information We Collect
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
            Information You Provide:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li><strong>Account Information:</strong> Name, email address, phone number, password, and profile photo</li>
            <li><strong>Profile Details:</strong> Bio, preferences, and account settings</li>
            <li><strong>Payment Information:</strong> Credit/debit card details, billing address, and payment history (processed securely through third-party payment processors)</li>
            <li><strong>Listing Information:</strong> Parking space details, photos, descriptions, location, pricing, and availability</li>
            <li><strong>Booking Information:</strong> Reservation details, dates, times, and vehicle information</li>
            <li><strong>Communications:</strong> Messages between users, customer support inquiries, and feedback</li>
            <li><strong>Verification Information:</strong> Documents for identity verification (e.g., driver's license)</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
            Information Collected Automatically:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
            <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on platform, search queries</li>
            <li><strong>Location Data:</strong> GPS coordinates when you use location-based features (with your permission)</li>
            <li><strong>Cookies and Tracking:</strong> See our Cookie Settings for details on cookies and similar technologies</li>
            <li><strong>Log Data:</strong> Server logs, error reports, and diagnostic information</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
            Information from Third Parties:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Social media platforms when you connect your account (e.g., Google, Facebook)</li>
            <li>Payment processors for transaction verification</li>
            <li>Background check providers (for enhanced verification)</li>
            <li>Marketing and analytics partners</li>
          </Box>
        </Paper>

        {/* How We Use Information */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            3. How We Use Your Information
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We use the information we collect for the following purposes:
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Service Provision:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Create and manage your account</li>
            <li>Process bookings and payments</li>
            <li>Facilitate communication between Hosts and Guests</li>
            <li>Display your listings and profile to other users</li>
            <li>Provide customer support and respond to inquiries</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Platform Improvement:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Analyze usage patterns to improve features and user experience</li>
            <li>Conduct research and development</li>
            <li>Test new features and functionality</li>
            <li>Personalize content and recommendations</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Safety and Security:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Verify user identities and prevent fraud</li>
            <li>Detect and prevent abuse, spam, and illegal activities</li>
            <li>Enforce our Terms of Service</li>
            <li>Protect the rights and safety of our users and the public</li>
            <li>Comply with legal obligations and resolve disputes</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Communication:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Send booking confirmations and transaction receipts</li>
            <li>Provide important updates about your account or the platform</li>
            <li>Send promotional materials and marketing communications (you can opt out)</li>
            <li>Request feedback and reviews</li>
          </Box>
        </Paper>

        {/* Information Sharing */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            4. How We Share Your Information
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We do not sell your personal information. We share your information only in the following circumstances:
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            With Other Users:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Your public profile information is visible to other users</li>
            <li>When you book a space, Hosts can see your name, profile photo, and vehicle information</li>
            <li>When someone books your space, you can see their booking details and contact information</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            With Service Providers:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Payment processors for transaction handling</li>
            <li>Cloud hosting and storage providers</li>
            <li>Analytics and marketing platforms</li>
            <li>Customer support and communication tools</li>
            <li>Background check and verification services</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            For Legal Reasons:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>To comply with legal obligations, court orders, or government requests</li>
            <li>To enforce our Terms of Service and other agreements</li>
            <li>To protect the rights, property, or safety of ParkVue, our users, or the public</li>
            <li>In connection with fraud prevention and security investigations</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Business Transfers:
          </Typography>
          <Typography variant="body1" color="text.secondary">
            If ParkVue is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
          </Typography>
        </Paper>

        {/* Data Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Lock sx={iconStyle} />
            5. Data Security
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We take data security seriously and implement industry-standard measures to protect your information:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Encryption of data in transit (SSL/TLS) and at rest</li>
            <li>Secure payment processing through PCI-DSS compliant providers</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication requirements for employees</li>
            <li>Monitoring for suspicious activity and unauthorized access</li>
            <li>Regular backups and disaster recovery procedures</li>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </Typography>
        </Paper>

        {/* Your Rights and Choices */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            6. Your Rights and Choices
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You have the following rights regarding your personal information:
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Access and Portability:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Request a copy of your personal information</li>
            <li>Download your data in a portable format</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Correction and Update:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Update your profile and account information anytime</li>
            <li>Request correction of inaccurate information</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Deletion:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Delete your account and associated data through account settings</li>
            <li>Request deletion of specific information (subject to legal retention requirements)</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Marketing Communications:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Opt out of marketing emails via unsubscribe links</li>
            <li>Manage notification preferences in account settings</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Location Data:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Control location permissions through your device settings</li>
            <li>Disable location services for the ParkVue app</li>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            To exercise these rights, please contact us at privacy@parkvue.com. We will respond to your request within 30 days.
          </Typography>
        </Paper>

        {/* Cookies */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Cookie sx={iconStyle} />
            7. Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We use cookies and similar tracking technologies to:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Remember your preferences and settings</li>
            <li>Keep you logged in</li>
            <li>Analyze how you use our platform</li>
            <li>Personalize content and advertisements</li>
            <li>Measure the effectiveness of our marketing campaigns</li>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            You can control cookies through your browser settings. Note that disabling cookies may affect platform functionality. Visit our Cookie Settings page for more detailed information and options.
          </Typography>
        </Paper>

        {/* Data Retention */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            8. Data Retention
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We retain your personal information for as long as necessary to:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Provide our services and maintain your account</li>
            <li>Comply with legal obligations (e.g., tax, accounting requirements)</li>
            <li>Resolve disputes and enforce our agreements</li>
            <li>Prevent fraud and enhance security</li>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            When you delete your account, we will delete or anonymize your personal information within 90 days, except where we must retain it for legal purposes. Some information may remain in backup systems for a limited period.
          </Typography>
        </Paper>

        {/* Children's Privacy */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            9. Children's Privacy
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ParkVue is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 18, we will take steps to delete that information promptly. If you believe we have collected information from a child, please contact us at privacy@parkvue.com.
          </Typography>
        </Paper>

        {/* International Data Transfers */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            10. International Data Transfers
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ParkVue operates globally, and your information may be transferred to, stored in, and processed in countries other than your own. These countries may have different data protection laws than your jurisdiction.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            When we transfer your information internationally, we implement appropriate safeguards to protect your data, including standard contractual clauses and ensuring our service providers maintain adequate security measures.
          </Typography>
        </Paper>

        {/* Changes to Privacy Policy */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            11. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Update the "Last Updated" date at the top of this policy</li>
            <li>Notify you via email or platform notification</li>
            <li>Provide a prominent notice on our platform</li>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Your continued use of ParkVue after changes become effective constitutes acceptance of the updated Privacy Policy.
          </Typography>
        </Paper>

        {/* Contact Us */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <ContactSupport sx={iconStyle} />
            12. Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </Typography>
          <Box sx={{ color: theme.palette.text.secondary }}>
            <Typography variant="body1"><strong>Email:</strong> privacy@parkvue.com</Typography>
            <Typography variant="body1"><strong>Data Protection Officer:</strong> dpo@parkvue.com</Typography>
            <Typography variant="body1"><strong>Support:</strong> support@parkvue.com</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Mailing Address:</strong><br />
              ParkVue Privacy Team<br />
              [Company Address]<br />
              [City, State, ZIP Code]
            </Typography>
          </Box>
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* Footer Note */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            By using ParkVue, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and sharing of your information as described herein.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPage;
