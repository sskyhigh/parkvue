import React, { useState, useEffect, useContext } from "react";
import { IconButton, Tooltip, useTheme, Badge, Box } from "@mui/material";
import {
    Chat as ChatIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import AIChatBot from "./AIChatBot";
import UserChat from "./UserChat";
import { Context } from "../../context/ContextProvider";
import { rtdb } from "../../firebase/config";
import { ref, onValue } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingButtonsHolder() {
    const [userChatOpen, setUserChatOpen] = useState(false);
    const [aiChatOpen, setAiChatOpen] = useState(false); // Managed here for coordination
    const [hidden, setHidden] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const theme = useTheme();
    const { state, dispatch, currentUser } = useContext(Context);

    // Sync with context for requested chat opening
    useEffect(() => {
        if (state.chat?.open) {
            setUserChatOpen(true);
            setAiChatOpen(false); // Close AI if user chat opens via context
        }
    }, [state.chat]);

    // Listen for unread count
    useEffect(() => {
        if (!currentUser?.uid) return;
        const userChatsRef = ref(rtdb, `user_chats/${currentUser.uid}`);
        const unsubscribe = onValue(userChatsRef, (snapshot) => {
            const data = snapshot.val();
            let count = 0;
            if (data) {
                Object.values(data).forEach((chat) => {
                    count += chat.unreadCount || 0;
                });
            }
            setUnreadCount(count);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const handleUserChatToggle = () => {
        if (userChatOpen) {
            if (state.chat?.open) {
                dispatch({ type: "UPDATE_CHAT", payload: { open: false, user: null } });
            }
            setUserChatOpen(false);
        } else {
            setUserChatOpen(true);
            setAiChatOpen(false); // Close AI chat
        }
    };

    const handleAiChatToggle = () => {
        if (aiChatOpen) {
            setAiChatOpen(false);
        } else {
            setAiChatOpen(true);
            setUserChatOpen(false); // Close User Chat
            if (state.chat?.open) {
                dispatch({ type: "UPDATE_CHAT", payload: { open: false, user: null } });
            }
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { x: 100, opacity: 0 },
        visible: (delay = 0) => ({
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay,
            },
        }),
        exit: (delay = 0) => ({
            x: 100,
            opacity: 0,
            transition: { delay },
        }),
    };

    return (
        <>
            {/* Toggle Button */}
            <Tooltip title={hidden ? "Show Chats" : "Hide Chats"} placement="left">
                <IconButton
                    onClick={() => setHidden((prev) => !prev)}
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
                        opacity: 0.8,
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

            <AnimatePresence>
                {!hidden && (
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 50,
                            right: 24,
                            display: "flex",
                            alignItems: "center", // Align buttons horizontally
                            gap: 1.2, // Space between buttons
                            zIndex: 9999,
                        }}
                    >
                        {/* User Chat Button (Left) */}
                        {currentUser && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                custom={0}
                            >
                                <Tooltip title="Messages" placement="top">
                                    <IconButton
                                        data-userchat-button
                                        onClick={handleUserChatToggle}
                                        sx={{
                                            width: 45,
                                            height: 45,
                                            bgcolor: theme.palette.secondary.main,
                                            color: "white",
                                            boxShadow: theme.shadows[8],
                                            "&:hover": {
                                                bgcolor: theme.palette.secondary.dark,
                                                transform: "scale(1.05)",
                                            },
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        <Badge badgeContent={unreadCount} color="error">
                                            <ChatIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                        )}

                        {/* AI Chat Button (Right) - Managed via prop now */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            custom={0.2}
                        >
                            <AIChatBot
                                isOpenProp={aiChatOpen}
                                setIsOpenProp={handleAiChatToggle}
                                headless={false} // Tell it we are rendering the button here? 
                                // Actually easier to just modify AIChatBot to accept isOpen prop
                                // Or wrap it. Let's modify AIChatBot to be controlled or self-managed.
                                // CURRENTLY: AIChatBot manages its own state. 
                                // We need to pass props to control it from here.
                                customToggle={() => handleAiChatToggle()}
                            // We'll conditionally render the button inside AIChatBot or just hide it there
                            // Better approach: Let AIChatBot handle ONLY the window, and we handle the button here.
                            // But AIChatBot has the logic. Let's pass a prop `customTrigger`?
                            // Simpler: Just render AIChatBot but pass isOpen.
                            />
                        </motion.div>
                    </Box>
                )}
            </AnimatePresence>

            {/* Render windows outside the animated button container to avoid layout issues */}
            <UserChat
                isOpen={userChatOpen}
                onClose={() => {
                    setUserChatOpen(false);
                    if (state.chat?.open)
                        dispatch({ type: "UPDATE_CHAT", payload: { open: false, user: null } });
                }}
            // Pass anchor if needed, but fixed positioning is fine.
            />
        </>
    );
}

export default FloatingButtonsHolder;
