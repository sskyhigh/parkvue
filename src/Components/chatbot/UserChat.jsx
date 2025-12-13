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
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
} from "@mui/material";
import {
    Chat as ChatIcon,
    Close as CloseIcon,
    Send as SendIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Context } from "../../context/ContextProvider";
import { rtdb } from "../../firebase/config";
import { ref, onValue, push, set, serverTimestamp, update, remove, get } from "firebase/database";

const UserChat = ({ isOpen, onClose }) => {
    const theme = useTheme();
    const { currentUser, state, dispatch } = useContext(Context);

    // 'list' or 'chat'
    const [view, setView] = useState("list");
    const [activeChat, setActiveChat] = useState(null); // { chatId, recipientId, recipientName }
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false); // Can be enhanced with real-time typing status

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);

    // Check global state for requested chat (from Rooms.js)
    useEffect(() => {
        if (state.chat?.open && state.chat?.user) {
            const recipient = state.chat.user;
            if (currentUser && recipient.uid && currentUser.uid !== recipient.uid) {
                const chatId = [currentUser.uid, recipient.uid].sort().join("_");

                // Setup active chat
                setActiveChat({
                    chatId,
                    recipientId: recipient.uid,
                    recipientName: recipient.name || "User",
                    recipientPhoto: recipient.photoURL
                });
                setView("chat");
            }
        }
    }, [state.chat, currentUser]);

    // Load chat list
    useEffect(() => {
        if (!currentUser?.uid) return;

        const userChatsRef = ref(rtdb, `user_chats/${currentUser.uid}`);
        const unsubscribe = onValue(userChatsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const chatList = Object.entries(data).map(([key, val]) => ({
                    chatId: key,
                    ...val
                })).sort((a, b) => b.lastUpdated - a.lastUpdated);
                setChats(chatList);
            } else {
                setChats([]);
            }
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Load messages for active chat
    useEffect(() => {
        if (!activeChat?.chatId) return;

        const messagesRef = ref(rtdb, `messages/${activeChat.chatId}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const msgList = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
                setMessages(msgList);

                // Mark as read
                if (currentUser?.uid) {
                    update(ref(rtdb, `user_chats/${currentUser.uid}/${activeChat.chatId}`), {
                        unreadCount: 0
                    });
                }
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [activeChat, currentUser]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        if (view === "chat") scrollToBottom();
    }, [messages, view]);

    // Focus input
    useEffect(() => {
        if (isOpen && view === "chat") {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, view]);

    const handleSendMessage = async () => {
        if (!input.trim() || !activeChat || !currentUser) return;

        const text = input.trim();
        setInput("");

        const message = {
            senderId: currentUser.uid,
            text,
            timestamp: serverTimestamp(),
        };

        // Push message
        await push(ref(rtdb, `messages/${activeChat.chatId}`), message);

        // Update user_chats for both users
        const updateData = {
            lastMessage: text,
            lastUpdated: serverTimestamp(),
            recipientId: activeChat.recipientId,
            recipientName: activeChat.recipientName, // Ideally store basic info
        };

        // Update current user's chat list
        await update(ref(rtdb, `user_chats/${currentUser.uid}/${activeChat.chatId}`), {
            ...updateData,
            recipientId: activeChat.recipientId,
            recipientName: activeChat.recipientName,
            recipientPhoto: activeChat.recipientPhoto || null,
            unreadCount: 0 // I read my own message
        });

        // Update recipient's chat list (increment unread)
        // We need to fetch current unread count or use transaction, but for simplicity:
        // We can't easily increment transactionally without a cloud function or proper rules/transaction.
        // For now, we'll just read and update or just set a flag.
        // Let's try a transaction for unreadCount.
        const recipientChatRef = ref(rtdb, `user_chats/${activeChat.recipientId}/${activeChat.chatId}`);

        // Check if it exists to get previous unread
        get(recipientChatRef).then((snap) => {
            let currentUnread = 0;
            if (snap.exists()) {
                currentUnread = snap.val().unreadCount || 0;
            }
            update(recipientChatRef, {
                lastMessage: text,
                lastUpdated: serverTimestamp(),
                recipientId: currentUser.uid,
                recipientName: currentUser.name || "User", // This might be stale if user updates profile, but okay for MVP
                unreadCount: currentUnread + 1
            });
        });
    };

    const handleDeleteHistory = async () => {
        if (activeChat?.chatId) {
            if (window.confirm("Delete chat history? This cannot be undone.")) {
                await remove(ref(rtdb, `messages/${activeChat.chatId}`));
                // Optional: remove from user_chats
                // await remove(ref(rtdb, `user_chats/${currentUser.uid}/${activeChat.chatId}`));
                setMessages([]);
            }
        }
    };

    const handleClose = () => {
        // Clear global state chat request
        dispatch({ type: 'UPDATE_CHAT', payload: { open: false, user: null } });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Paper
            elevation={16}
            ref={chatBoxRef}
            sx={{
                position: "fixed",
                bottom: 100,
                right: 80, // Offset from AI bot if side-by-side, or same position if toggled
                // We'll let the holder position it, but for now absolute with fixed coords
                // Actually, the holder handles animation, but this Paper is the content.
                // Let's make this component just return the CONTENT, and Holder wraps it in Paper?
                // No, current Chatbot.jsx returns the Paper. I'll stick to that style.
                // I should adjust the `right` position or valid relative to holder.
                // I'll stick to "right: 24" (same as chatbot) assuming only one is open at a time.
                right: 24,
                width: { xs: 340, sm: 400, md: 450 },
                height: { xs: 500, sm: 620 },
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`, // Use secondary for UserChat to distinguish
                boxShadow: theme.shadows[20],
                zIndex: 10000,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: theme.palette.secondary.main, // Different color for User Chat
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {view === "chat" && (
                        <IconButton
                            size="small"
                            onClick={() => setView("list")}
                            sx={{ color: "white", mr: 1 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Avatar
                        sx={{
                            bgcolor: "white",
                            color: theme.palette.secondary.main,
                            width: 36,
                            height: 36,
                        }}
                    >
                        {activeChat?.recipientPhoto ? (
                            <img src={activeChat.recipientPhoto} alt="" style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <ChatIcon fontSize="small" />
                        )}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                            {view === "chat" ? `Chat with ${activeChat?.recipientName?.split(" ")[0]}` : "Chats"}
                        </Typography>
                        {view === "chat" && (
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                Online via Parkvue
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Stack direction="row" spacing={0.5}>
                    {view === "chat" && messages.length > 0 && (
                        <IconButton
                            onClick={handleDeleteHistory}
                            sx={{
                                color: "white",
                                "&:hover": {
                                    bgcolor: alpha(theme.palette.error.main, 0.2),
                                },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton
                        onClick={handleClose}
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

            {/* Content Area */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {view === "list" ? (
                    <List sx={{ p: 0 }}>
                        {chats.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                                <Typography>No active chats.</Typography>
                                <Typography variant="caption">Start a conversation from a parking space listing!</Typography>
                            </Box>
                        ) : (
                            chats.map((chat) => (
                                <React.Fragment key={chat.chatId}>
                                    <ListItem
                                        button
                                        onClick={() => {
                                            setActiveChat(chat);
                                            setView("chat");
                                        }}
                                        alignItems="flex-start"
                                        sx={{
                                            '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.05) }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Badge badgeContent={chat.unreadCount} color="error">
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {chat.recipientName || "User"}
                                                </Typography>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                        sx={{ display: 'inline', fontWeight: chat.unreadCount > 0 ? 700 : 400 }}
                                                    >
                                                        {chat.lastMessage ? (chat.lastMessage.length > 30 ? chat.lastMessage.substring(0, 30) + "..." : chat.lastMessage) : "No messages"}
                                                    </Typography>
                                                    {chat.lastUpdated && (
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            {/* Requires date-fns or similar, or just basic JS Date */}
                                                            {new Date(chat.lastUpdated).toLocaleDateString()}
                                                        </Typography>
                                                    )}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                ) : (
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2, gap: 1.5 }}>
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: msg.senderId === currentUser?.uid ? "flex-end" : "flex-start",
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: "80%",
                                        bgcolor:
                                            msg.senderId === currentUser?.uid
                                                ? theme.palette.secondary.main
                                                : theme.palette.background.paper,
                                        color:
                                            msg.senderId === currentUser?.uid
                                                ? "white"
                                                : theme.palette.text.primary,
                                        borderRadius: 2,
                                        borderTopLeftRadius: msg.senderId === currentUser?.uid ? 12 : 2,
                                        borderTopRightRadius: msg.senderId === currentUser?.uid ? 2 : 12,
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, fontSize: '0.65rem', textAlign: 'right' }}>
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>
                )}
            </Box>

            {/* Input Area (Only in Chat View) */}
            {view === "chat" && (
                <Box
                    sx={{
                        p: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    <Stack direction="row" spacing={1}>
                        <TextField
                            inputRef={inputRef}
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />
                        <IconButton
                            onClick={handleSendMessage}
                            disabled={!input.trim()}
                            sx={{
                                bgcolor: theme.palette.secondary.main,
                                color: "white",
                                "&:hover": {
                                    bgcolor: theme.palette.secondary.dark,
                                },
                                "&.Mui-disabled": {
                                    bgcolor: theme.palette.action.disabled,
                                },
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Stack>
                </Box>
            )}
        </Paper>
    );
};

export default UserChat;
