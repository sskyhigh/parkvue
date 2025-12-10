import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  IconButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import ChatBot from "./Chatbot";

// Client-side component for toggling panels with animations
export function FloatingButtonsHolder() {
  const [hidden, setHidden] = useState(false);
  const theme = useTheme();

  const notifVariant = {
    hidden: {
      x: 200,
      opacity: 0,
      transition: { delay: 0.1, ease: "easeInOut", duration: 0.3 },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 },
    },
    exit: {
      x: 200,
      opacity: 0,
      transition: { delay: 0.1, ease: "easeInOut", duration: 0.3 },
    },
  };

  return (
    <>
      {/* Half-circle toggle button */}
      <Tooltip title={hidden ? "Show Chat" : "Hide Chat"} placement="left">
        <IconButton
          onClick={() => {
            setTimeout(() => {
              setHidden((prev) => !prev);
            }, 100);
          }}
          sx={{
            position: "fixed",
            bottom: 20,
            overflow: "visible",
            right: 0,
            width: 22,
            height: 28,
            bgcolor: theme.palette.primary.main,
            color: "white",
            borderTopLeftRadius: "50%",
            borderBottomLeftRadius: "50%",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            boxShadow: theme.shadows[8],
            zIndex: 9999,
            opacity: 0.5,
            "&:hover": {
              opacity: 1,
              bgcolor: theme.palette.primary.dark,
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {hidden ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Tooltip>

      {/* ChatBot Container */}
      <AnimatePresence>
        {!hidden && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notifVariant}
            style={{
              position: "fixed",
              bottom: 0,
              right: 0,
              zIndex: 9999,
              pointerEvents: "auto",
            }}
          >
            <Box
              sx={{
                position: "relative",
                mr: 1,
                mb: 1,
              }}
            >
              <ChatBot />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingButtonsHolder;