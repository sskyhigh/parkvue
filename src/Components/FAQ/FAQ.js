import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha
} from '@mui/material';
import {
  ExpandMore,
  HelpOutline,
} from '@mui/icons-material';
import { useState } from 'react';

const faqData = [
  {
    question: "How does ParkVue work for users looking to rent a parking spot?",
    answer: "ParkVue makes it easy for users to find and rent nearby parking spots. Simply search for available spots on the app, choose the one that suits your needs, and complete the booking process. You will receive instructions on how to access the parking spot, and your payment is securely handled through the app.",
  },
  {
    question: "Can I trust the accuracy of parking spot listings on ParkVue?",
    answer: "Yes, you can! All parking spot listings on ParkVue are verified by our team. We ensure that the information, pricing, and location details are accurate and up-to-date for a seamless rental experience.",
  },
  {
    question: "How do I list my own parking spot on ParkVue as a space owner?",
    answer: "Listing your parking spot is easy. Sign up as a space owner on ParkVue, provide details about your spot, set your desired pricing, and upload photos. Once your listing is approved, it will be visible to users searching for parking in your area.",
  },
  {
    question: "What payment methods are accepted on ParkVue?",
    answer: "ParkVue accepts a variety of payment methods, including major credit cards and digital payment options. We use secure payment processing to protect your financial information.",
  },
  {
    question: "Can I rent a parking spot on a long-term basis, such as monthly or annually?",
    answer: "Yes, you can rent parking spots for various durations, including daily, weekly, monthly, or even annually. The choice is yours, and many parking space owners offer flexible rental options.",
  },
  {
    question: "How do I ensure the safety and security of my vehicle when renting a parking spot on ParkVue?",
    answer: "ParkVue prioritizes user safety. We recommend renting spots from verified owners with positive reviews. Additionally, parking spots are often located in safe and monitored areas, providing added security for your vehicle.",
  },
  {
    question: "What if I have an issue or need assistance while using ParkVue?",
    answer: "We are here to help! ParkVue offers customer support to assist you with any questions or concerns. You can reach out to our support team through the app, and we will do our best to resolve your issues promptly.",
  },
];

function FAQ() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: isDarkMode
          ? "linear-gradient(135deg, #1a1a23 0%, #0f0f15 100%)"
          : "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
        position: "relative",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: isDarkMode
            ? "linear-gradient(45deg, rgba(108, 99, 255, 0.05) 0%, rgba(255, 101, 132, 0.1) 100%)"
            : "linear-gradient(45deg, rgba(0, 172, 202, 0.05) 0%, rgba(0, 188, 202, 0.1) 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: isDarkMode
            ? "linear-gradient(45deg, rgba(108, 99, 255, 0.03) 0%, rgba(255, 101, 132, 0.08) 100%)"
            : "linear-gradient(45deg, rgba(0, 172, 202, 0.03) 0%, rgba(0, 154, 186, 0.08) 100%)",
        }}
      />

      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(255, 101, 132, 0.3))"
                : "linear-gradient(135deg, #00acca15, #00bcca30)",
              borderRadius: "50%",
              mb: 3,
            }}
          >
            <HelpOutline
              sx={{
                fontSize: 40,
                color: "primary.main",
              }}
            />
          </Box>

          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: "600",
              fontSize: "1.1rem",
              letterSpacing: 2,
              mb: 2,
              display: "block",
            }}
          >
            Frequently Asked Questions
          </Typography>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "700",
              fontSize: { xs: "2rem", md: "3rem" },
              background: isDarkMode
                ? theme.palette.primary.main
                : "linear-gradient(45deg, #00acca 30%, #00bcca 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Let's Answer Your Questions
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? theme.palette.text.secondary : "text.secondary",
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            Find quick answers to common questions about ParkVue parking solutions
          </Typography>
        </Box>

        {/* FAQ Accordions */}
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          {faqData.map((item, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                background: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.8)
                  : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                border: isDarkMode
                  ? `1px solid ${alpha(theme.palette.divider, 0.2)}`
                  : "1px solid rgba(0, 172, 202, 0.1)",
                borderRadius: "12px !important",
                boxShadow: isDarkMode
                  ? "0 4px 20px rgba(0, 0, 0, 0.2)"
                  : "0 4px 20px rgba(0, 172, 202, 0.08)",
                mb: 2,
                transition: "all 0.3s ease",
                "&:before": {
                  display: "none",
                },
                "&:hover": {
                  boxShadow: isDarkMode
                    ? "0 8px 30px rgba(0, 0, 0, 0.25)"
                    : "0 8px 30px rgba(0, 172, 202, 0.12)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-expanded": {
                  background: isDarkMode
                    ? alpha(theme.palette.background.paper, 0.95)
                    : "rgba(255, 255, 255, 0.95)",
                  boxShadow: isDarkMode
                    ? "0 8px 35px rgba(0, 0, 0, 0.25)"
                    : "0 8px 35px rgba(0, 172, 202, 0.15)",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMore
                    sx={{
                      color: "primary.main",
                      transition: "transform 0.3s ease",
                    }}
                  />
                }
                sx={{
                  padding: { xs: "16px 20px", md: "20px 24px" },
                  minHeight: "auto !important",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0 !important",
                  },
                  "&.Mui-expanded": {
                    minHeight: "auto !important",
                    "& .MuiAccordionSummary-expandIconWrapper": {
                      transform: "rotate(180deg)",
                    },
                  },
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: "600",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    color: expanded === `panel${index}` ? "primary.main" : (isDarkMode ? theme.palette.text.primary : "text.primary"),
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  padding: { xs: "0 20px 20px", md: "0 24px 24px" },
                  borderTop: isDarkMode
                    ? `1px solid ${alpha(theme.palette.divider, 0.2)}`
                    : "1px solid rgba(0, 172, 202, 0.1)",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? theme.palette.text.secondary : "text.secondary",
                    lineHeight: 1.7,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    paddingTop: 2,
                  }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? theme.palette.text.secondary : "text.secondary",
              mb: 3,
              fontSize: { xs: "1rem", md: "1.1rem" },
            }}
          >
            Still have questions?
          </Typography>
          <Box
            component="button"
            sx={{
              background: isDarkMode
                ? theme.customStyles?.neonGradient || "linear-gradient(45deg, #6C63FF, #FF6584)"
                : "linear-gradient(45deg, #00acca, #00bcca)",
              color: "white",
              border: "none",
              padding: "12px 32px",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: isDarkMode
                ? "0 6px 20px rgba(108, 99, 255, 0.4)"
                : "0 6px 20px rgba(0, 172, 202, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: isDarkMode
                  ? "0 10px 30px rgba(108, 99, 255, 0.6)"
                  : "0 10px 30px rgba(0, 172, 202, 0.4)",
                background: isDarkMode
                  ? "linear-gradient(45deg, #FF6584, #6C63FF)"
                  : "linear-gradient(45deg, #00bcca, #00acca)",
              },
            }}
          >
            Contact Support
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default FAQ;