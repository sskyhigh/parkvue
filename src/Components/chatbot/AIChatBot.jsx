import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    IconButton,
    Paper,
    Typography,
    TextField,
    Avatar,
    Badge,
    Button,
    useTheme,
    alpha,
    Stack,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    SmartToy as RobotIcon,
    Close as CloseIcon,
    Send as SendIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import { Context } from "../../context/ContextProvider";
import { marked } from "marked";
import badWords from "./badwords";

// Google Generative AI (ESM clean import)
import { GoogleGenAI } from "@google/genai";
import config from "./config";

const AIChatBot = ({ isOpenProp, setIsOpenProp, customToggle }) => {
    const theme = useTheme();
    const { currentUser } = useContext(Context);

    // Initial local state if not controlled, or use prop
    const [localIsOpen, setLocalIsOpen] = useState(false);

    // Derived state
    const isOpen = isOpenProp !== undefined ? isOpenProp : localIsOpen;
    const setIsOpen = setIsOpenProp || setLocalIsOpen;
    const [messages, setMessages] = useState([
        {
            text: "Hello! I'm your Parkvue Virtual Assistant. How can I help you with parking spaces, bookings, or any questions about our platform today?",
            sender: "model",
            isHTML: true,
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [clearHistoryDialog, setClearHistoryDialog] = useState(false);

    const messagesEndRef = useRef(null);
    const chatBoxRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize Gemini
    const apiKey = process.env.REACT_APP_GOOGLE_AI_API_KEY;
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Load history
    useEffect(() => {
        if (currentUser?.uid) {
            const saved = localStorage.getItem(`pv.chat.${currentUser.uid}`);
            if (saved) {
                try {
                    setMessages(JSON.parse(saved));
                } catch (error) {
                    console.error("Error loading chat history:", error);
                }
            }
        }
    }, [currentUser]);

    // Save history
    useEffect(() => {
        if (currentUser?.uid) {
            localStorage.setItem(
                `pv.chat.${currentUser.uid}`,
                JSON.stringify(messages)
            );
        }
    }, [messages, currentUser]);

    async function generateResponse(text) {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config,
            contents: text,
        });
        return response.text;
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Lock body scroll when chatbot is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Focus input when chatbot opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close chatbot when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
                // Check if the click is also not on the floating button
                const floatingButton = document.querySelector('[data-aichatbot-button]');
                if (floatingButton && !floatingButton.contains(event.target)) {
                    setIsOpen(false);
                }
            }
        };

        if (isOpen) {
            // Add a small delay to prevent immediate closing when opening
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Check for profanity
        const containsBadWord = badWords.some(word =>
            input.toLowerCase().includes(word.toLowerCase())
        );

        if (containsBadWord) {
            setMessages((prev) => [
                ...prev,
                {
                    text: "Please keep the conversation respectful. We're here to help with your Parkvue experience!",
                    sender: "system",
                },
            ]);
            setInput("");
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return;
        }

        if (input.trim()) {
            setMessages((prev) => [...prev, { text: input, sender: "user" }]);
            setInput("");
        }

        setIsTyping(true);

        try {
            const reply = await generateResponse(input);

            const formatted = marked.parse(reply);

            setMessages((prev) => [
                ...prev,
                { text: formatted, sender: "model", isHTML: true },
            ]);
        } catch (error) {
            // Error is already set in generateResponse
            setMessages((prev) => [
                ...prev,
                {
                    text: "I apologize, but I'm having trouble connecting to my AI service. Please try again in a moment.",
                    sender: "system",
                },
            ]);
        } finally {
            setIsTyping(false);
            // Focus input after response with a delay to ensure DOM has updated
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };

    const handleClearHistory = () => {
        if (currentUser?.uid) {
            localStorage.removeItem(`pv.chat.${currentUser.uid}`);
        }
        setMessages([
            {
                text: "Hello! I'm your Parkvue Virtual Assistant. How can I help you with parking spaces, bookings, or any questions about our platform today?",
                sender: "model",
                isHTML: true,
            },
        ]);
        setClearHistoryDialog(false);
    };

    return (
        <>
            {/* Floating button - Always visible */}
            {/* Floating button - Conditionally render only if no custom toggle provided, or just render inside Holder */}
            {/* If customToggle is passed, we assume parent handles the button rendering or we render it using customToggle */}

            {!customToggle && (
                <Tooltip title="Parkvue Virtual Assistant" placement="left">
                    <IconButton
                        data-aichatbot-button
                        onClick={() => {
                            setIsOpen(!isOpen);
                            scrollToBottom();
                        }}
                    // ... styles ...
                    >
                        <RobotIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            )}

            {/* If customToggle IS passed, we render the button here but use the custom click handler 
                Actually, the Holder renders the button area. We just need to expose the Window.
                But wait, the Holder is rendering the Button. So we should NOT render the button here if controlled.
            */}

            {customToggle && (
                <Tooltip title="Parkvue Virtual Assistant" placement="top">
                    <IconButton
                        data-aichatbot-button
                        onClick={() => {
                            customToggle();
                            setTimeout(scrollToBottom, 100);
                        }}
                        sx={{
                            width: 45,
                            height: 45,
                            bgcolor: theme.palette.primary.main,
                            color: "white",
                            boxShadow: theme.shadows[8],
                            "&:hover": {
                                bgcolor: theme.palette.primary.dark,
                                transform: "scale(1.05)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <RobotIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            )}

            {/* Chat popup - Only show when isOpen is true */}
            {
                isOpen && (
                    <Paper
                        elevation={16}
                        ref={chatBoxRef}
                        sx={{
                            position: "fixed",
                            bottom: 100,
                            right: 24,
                            width: { xs: 340, sm: 400, md: 450 },
                            height: { xs: 500, sm: 620 },
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 3,
                            overflow: "hidden",
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            boxShadow: theme.shadows[20],
                            zIndex: 10000,
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: theme.palette.primary.main,
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: "white",
                                        color: theme.palette.primary.main,
                                        width: 36,
                                        height: 36,
                                    }}
                                >
                                    <RobotIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                                        Parkvue Assistant
                                    </Typography>
                                    <Badge
                                        variant="dot"
                                        color="success"
                                        sx={{
                                            "& .MuiBadge-dot": {
                                                backgroundColor: "#4CAF50",
                                            },
                                        }}
                                    >
                                        <Typography variant="caption">Online</Typography>
                                    </Badge>
                                </Box>
                            </Box>
                            <Stack direction="row" spacing={0.5}>
                                <IconButton
                                    onClick={() => setClearHistoryDialog(true)}
                                    sx={{
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: alpha(theme.palette.error.main, 0.2),
                                        },
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    onClick={() => setIsOpen(false)}
                                    sx={{
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: alpha(theme.palette.common.white, 0.1),
                                        },
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                        </Box>

                        {/* Message area */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                p: 2,
                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.5,
                            }}
                        >
                            {messages.map((message, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                                        animation: "fadeIn 0.3s ease",
                                        "@keyframes fadeIn": {
                                            from: { opacity: 0, transform: "translateY(10px)" },
                                            to: { opacity: 1, transform: "translateY(0)" },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: "80%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: message.sender === "user" ? "flex-end" : "flex-start",
                                            gap: 0.5,
                                        }}
                                    >
                                        {/* Avatar for AI messages */}
                                        {message.sender === "model" && (
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Avatar
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        color: theme.palette.primary.main,
                                                    }}
                                                >
                                                    <RobotIcon sx={{ fontSize: 12 }} />
                                                </Avatar>
                                                <Typography variant="caption" color="text.secondary">
                                                    Assistant
                                                </Typography>
                                            </Stack>
                                        )}

                                        {/* Avatar for user messages */}
                                        {message.sender === "user" && (
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Typography variant="caption" color="text.secondary">
                                                    You
                                                </Typography>
                                                <Avatar
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                        color: theme.palette.secondary.main,
                                                    }}
                                                >
                                                    <PersonIcon sx={{ fontSize: 12 }} />
                                                </Avatar>
                                            </Stack>
                                        )}

                                        {/* Message bubble */}
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 1.5,
                                                bgcolor:
                                                    message.sender === "user"
                                                        ? theme.palette.primary.main
                                                        : message.sender === "model"
                                                            ? theme.palette.background.paper
                                                            : alpha(theme.palette.warning.main, 0.1),
                                                color:
                                                    message.sender === "user"
                                                        ? "white"
                                                        : theme.palette.text.primary,
                                                borderRadius: 2,
                                                borderTopLeftRadius: message.sender === "user" ? 12 : 2,
                                                borderTopRightRadius: message.sender === "user" ? 2 : 12,
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            }}
                                        >
                                            {message.isHTML ? (
                                                <Box
                                                    sx={{
                                                        fontSize: "0.875rem",
                                                        lineHeight: 1.4,
                                                        "& strong": { fontWeight: 700 },
                                                        "& em": { fontStyle: "italic" },
                                                        "& p": { margin: "0.25em 0" },
                                                        "& ul, & ol": {
                                                            margin: "0.25em 0",
                                                            paddingLeft: "1.5em",
                                                        },
                                                        "& li": { margin: "0.125em 0" },
                                                        "& a": {
                                                            color: "inherit",
                                                            textDecoration: "underline",
                                                        },
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: message.text }}
                                                />
                                            ) : (
                                                <Typography variant="body2">{message.text}</Typography>
                                            )}
                                        </Paper>
                                    </Box>
                                </Box>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 1.5,
                                            bgcolor: theme.palette.background.paper,
                                            borderRadius: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <CircularProgress size={16} />
                                        <Typography variant="caption" color="text.secondary">
                                            Thinking...
                                        </Typography>
                                    </Paper>
                                </Box>
                            )}

                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Input area */}
                        <Box
                            sx={{
                                p: 2,
                                borderTop: `1px solid ${theme.palette.divider}`,
                                bgcolor: theme.palette.background.paper,
                            }}
                        >
                            <Stack spacing={1}>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <TextField
                                        inputRef={inputRef}
                                        fullWidth
                                        size="small"
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        autoFocus
                                        disabled={isTyping}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        }}
                                    />
                                    <span>
                                        <IconButton
                                            onClick={handleSend}
                                            disabled={!input.trim() || isTyping}
                                            sx={{
                                                bgcolor: theme.palette.primary.main,
                                                color: "white",
                                                "&:hover": {
                                                    bgcolor: theme.palette.primary.dark,
                                                    transform: "scale(1.05)",
                                                },
                                                "&.Mui-disabled": {
                                                    bgcolor: theme.palette.action.disabled,
                                                },
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </span>
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>
                )}

            {/* Clear History Dialog */}
            <Dialog
                open={clearHistoryDialog}
                onClose={() => setClearHistoryDialog(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Clear Chat History</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to clear all chat history? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClearHistoryDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleClearHistory}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Clear History
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AIChatBot;
