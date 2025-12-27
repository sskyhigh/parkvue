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
  VerifiedUser,
  Warning,
  Shield,
  Fingerprint,
  VpnKey,
  ReportProblem,
  Https,
} from '@mui/icons-material';

const SecurityPage = () => {
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
          <Security sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
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
            Security at ParkVue
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Your safety and security are our top priorities. Learn about our comprehensive security measures.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Last Updated: December 27, 2025
          </Typography>
        </Box>

        {/* Our Commitment */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Shield sx={iconStyle} />
            Our Security Commitment
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            At ParkVue, we are committed to providing a safe and secure platform for all users. We invest heavily in security infrastructure, employ industry best practices, and continuously monitor for threats to protect your data and ensure safe transactions.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Our multi-layered security approach encompasses technical safeguards, operational procedures, and user education to create a trustworthy parking marketplace.
          </Typography>
        </Paper>

        {/* Data Protection */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Lock sx={iconStyle} />
            Data Protection & Encryption
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
            Encryption Standards:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li><strong>SSL/TLS Encryption:</strong> All data transmitted between your device and our servers is encrypted using industry-standard 256-bit SSL/TLS encryption</li>
            <li><strong>Data at Rest:</strong> Your personal information is encrypted in our databases using AES-256 encryption</li>
            <li><strong>End-to-End Security:</strong> Payment information is encrypted from the moment you enter it until it reaches our secure payment processors</li>
            <li><strong>Secure Protocols:</strong> We use HTTPS across our entire platform to prevent man-in-the-middle attacks</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
            Data Access Controls:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Strict role-based access controls limit who can view your data</li>
            <li>Multi-factor authentication required for all employee access</li>
            <li>Comprehensive audit logs track all data access</li>
            <li>Regular access reviews and permission audits</li>
            <li>Automated alerts for suspicious access patterns</li>
          </Box>
        </Paper>

        {/* Payment Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Https sx={iconStyle} />
            Payment Security
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            We take payment security extremely seriously and implement multiple layers of protection:
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            PCI DSS Compliance:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>ParkVue is PCI DSS (Payment Card Industry Data Security Standard) compliant</li>
            <li>We use certified third-party payment processors (Stripe, PayPal) for all transactions</li>
            <li>Your credit card details are never stored on our servers</li>
            <li>Tokenization ensures sensitive payment data is protected</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Fraud Prevention:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Real-time transaction monitoring for suspicious activity</li>
            <li>Advanced fraud detection algorithms analyze booking patterns</li>
            <li>3D Secure authentication for added card verification</li>
            <li>Automated flagging of high-risk transactions</li>
            <li>Secure payment dispute resolution process</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Payout Protection:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Host payouts are held securely until booking completion</li>
            <li>Bank account verification required for payouts</li>
            <li>Anti-money laundering (AML) compliance checks</li>
          </Box>
        </Paper>

        {/* Account Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <VpnKey sx={iconStyle} />
            Account Security
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600, color: theme.palette.primary.main }}>
            Password Protection:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Passwords are hashed using bcrypt with salt for maximum security</li>
            <li>Password strength requirements enforce secure credentials</li>
            <li>Account lockout after multiple failed login attempts</li>
            <li>Secure password reset process with email verification</li>
            <li>Session timeout for inactive accounts</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600, color: theme.palette.primary.main }}>
            Two-Factor Authentication (2FA):
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We strongly recommend enabling two-factor authentication for an additional layer of account protection:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>SMS-based verification codes</li>
            <li>Authenticator app support (Google Authenticator, Authy)</li>
            <li>Backup codes for account recovery</li>
            <li>2FA required for sensitive actions like changing payment methods</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600, color: theme.palette.primary.main }}>
            Login Security:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Email notifications for new device logins</li>
            <li>Active session management - view and revoke active sessions</li>
            <li>IP address monitoring for unusual login locations</li>
            <li>Secure "Remember Me" functionality with encrypted tokens</li>
          </Box>
        </Paper>

        {/* User Verification */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <VerifiedUser sx={iconStyle} />
            User Verification & Trust
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            We implement comprehensive verification processes to ensure the authenticity and trustworthiness of our community:
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Identity Verification:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Email and phone number verification required for all accounts</li>
            <li>Government-issued ID verification available for enhanced trust</li>
            <li>Address verification for parking space listings</li>
            <li>Business verification for commercial parking operators</li>
            <li>Social media account linking for additional validation</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Listing Verification:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Manual review of new parking space listings</li>
            <li>Photo verification to ensure accuracy</li>
            <li>Location verification using GPS coordinates</li>
            <li>Proof of ownership or rental rights required</li>
            <li>Regular audits of active listings</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Review System:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Verified reviews from actual bookings only</li>
            <li>Two-way review system for transparency</li>
            <li>Automated detection of fake or manipulated reviews</li>
            <li>Rating system helps identify trusted users</li>
          </Box>
        </Paper>

        {/* Platform Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Fingerprint sx={iconStyle} />
            Platform & Infrastructure Security
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Technical Safeguards:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li><strong>Firewalls:</strong> Advanced firewalls protect our infrastructure from unauthorized access</li>
            <li><strong>DDoS Protection:</strong> Cloud-based DDoS mitigation prevents service disruption</li>
            <li><strong>Intrusion Detection:</strong> Real-time monitoring detects and blocks malicious activity</li>
            <li><strong>Vulnerability Scanning:</strong> Automated daily scans identify potential security issues</li>
            <li><strong>Penetration Testing:</strong> Regular third-party security audits test our defenses</li>
            <li><strong>Security Patches:</strong> Rapid deployment of security updates and patches</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Infrastructure Security:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Hosting on enterprise-grade cloud platforms (AWS, Google Cloud)</li>
            <li>Geographically distributed data centers for redundancy</li>
            <li>Automated backup systems with encryption</li>
            <li>Disaster recovery and business continuity planning</li>
            <li>24/7 security monitoring and incident response team</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Application Security:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Secure coding practices following OWASP guidelines</li>
            <li>Input validation and sanitization to prevent injection attacks</li>
            <li>Protection against XSS, CSRF, and SQL injection</li>
            <li>API rate limiting to prevent abuse</li>
            <li>Regular security code reviews</li>
          </Box>
        </Paper>

        {/* Safety Features */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <Warning sx={iconStyle} />
            Safety Features & Guidelines
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            In-App Safety Tools:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>In-platform messaging keeps communication secure and documented</li>
            <li>Report and block features for problematic users</li>
            <li>Emergency contact information easily accessible</li>
            <li>GPS tracking confirms parking location accuracy</li>
            <li>Photo documentation of parking space condition</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Community Guidelines Enforcement:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Clear community standards and code of conduct</li>
            <li>24/7 trust and safety team reviews reports</li>
            <li>Swift action against policy violations</li>
            <li>Account suspension and banning for serious infractions</li>
            <li>Cooperation with law enforcement when necessary</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Safety Recommendations:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Meet in well-lit, public areas when showing parking spaces</li>
            <li>Never share personal contact information outside the platform</li>
            <li>Complete all payments through ParkVue's secure system</li>
            <li>Document any damage with photos immediately</li>
            <li>Trust your instincts - report anything suspicious</li>
          </Box>
        </Paper>

        {/* Reporting Security Issues */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <ReportProblem sx={iconStyle} />
            Reporting Security Concerns
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            We take all security concerns seriously and encourage responsible disclosure. If you discover a security vulnerability or have concerns:
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Security Vulnerability Reporting:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Email our security team at: <strong>security@parkvue.com</strong></li>
            <li>Provide detailed information about the vulnerability</li>
            <li>Do not publicly disclose the issue until we've had time to address it</li>
            <li>We commit to acknowledging reports within 48 hours</li>
            <li>Bug bounty program for responsible security researchers</li>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Report Suspicious Activity:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Use in-app reporting for suspicious users or listings</li>
            <li>Contact support immediately if you suspect fraud</li>
            <li>Report phishing attempts or impersonation</li>
            <li>Flag inappropriate content or behavior</li>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontWeight: 600 }}>
            Emergency Contact: If you are in immediate danger, contact local law enforcement first, then notify us at <strong>emergency@parkvue.com</strong>
          </Typography>
        </Paper>

        {/* Compliance */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Security Certifications & Compliance
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            ParkVue maintains compliance with industry security standards and regulations:
          </Typography>
          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li><strong>PCI DSS Level 1:</strong> Payment Card Industry Data Security Standard certified</li>
            <li><strong>GDPR Compliant:</strong> General Data Protection Regulation compliance for EU users</li>
            <li><strong>SOC 2 Type II:</strong> Annual audits verify our security controls</li>
            <li><strong>ISO 27001:</strong> Information security management system certification</li>
            <li><strong>CCPA Compliant:</strong> California Consumer Privacy Act compliance</li>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            We undergo regular third-party security audits and maintain certifications that demonstrate our commitment to protecting your data.
          </Typography>
        </Paper>

        {/* Your Role in Security */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Your Role in Security
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Security is a shared responsibility. Here's how you can help protect your account:
          </Typography>

          <Box component="ul" sx={{ color: theme.palette.text.secondary, pl: 3 }}>
            <li>Use a strong, unique password and change it regularly</li>
            <li>Enable two-factor authentication on your account</li>
            <li>Never share your password or login credentials</li>
            <li>Be cautious of phishing emails or suspicious links</li>
            <li>Log out from shared or public devices</li>
            <li>Keep your email account secure</li>
            <li>Review your account activity regularly</li>
            <li>Update your contact information to receive security alerts</li>
            <li>Report suspicious activity immediately</li>
            <li>Only communicate and transact through the ParkVue platform</li>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
            <strong>⚠️ Important:</strong> ParkVue will never ask for your password via email, phone, or text message. If someone claims to be from ParkVue and requests your credentials, it's a scam - report it immediately.
          </Typography>
        </Paper>

        {/* Contact Security Team */}
        <Paper sx={sectionStyle}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Contact Our Security Team
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Have questions or concerns about security at ParkVue?
          </Typography>

          <Box sx={{ color: theme.palette.text.secondary }}>
            <Typography variant="body1"><strong>Security Team:</strong> security@parkvue.com</Typography>
            <Typography variant="body1"><strong>Trust & Safety:</strong> safety@parkvue.com</Typography>
            <Typography variant="body1"><strong>Emergency Line:</strong> emergency@parkvue.com</Typography>
            <Typography variant="body1"><strong>Report Abuse:</strong> abuse@parkvue.com</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>24/7 Support:</strong> Available through Parkvue AI chatbot
            </Typography>
          </Box>
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* Footer Note */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Security is an ongoing commitment. We continuously update our security measures to protect against emerging threats. This page is updated regularly to reflect our current security practices.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SecurityPage;
