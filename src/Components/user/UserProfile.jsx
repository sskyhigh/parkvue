import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Avatar,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Edit,
    Person,
    Email,
    Security,
    Badge,
} from '@mui/icons-material';
import { useValue, Context } from '../../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { updateProfile, updatePassword, sendEmailVerification } from 'firebase/auth';
import { auth, db, doc, updateDoc } from '../../firebase/config';
import { PulseLoader } from 'react-spinners';

const UserProfile = () => {
    const { dispatch } = useValue();
    const { currentUser, setCurrentUser } = useContext(Context);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const navigate = useNavigate();

    const [openNameDialog, setOpenNameDialog] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(auth.currentUser?.emailVerified || false);
    const [sendingVerification, setSendingVerification] = useState(false);

    const nameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Check email verification status
    useEffect(() => {
        const checkVerification = async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload();
                setEmailVerified(auth.currentUser.emailVerified);
            }
        };

        // Check immediately
        checkVerification();

        // Check every 5 seconds if not verified
        const interval = setInterval(() => {
            if (!emailVerified && auth.currentUser) {
                checkVerification();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [emailVerified]);

    const handleSendVerification = async () => {
        try {
            setSendingVerification(true);
            if (auth.currentUser && !auth.currentUser.emailVerified) {
                await sendEmailVerification(auth.currentUser);
                dispatch({
                    type: 'UPDATE_ALERT',
                    payload: {
                        open: true,
                        severity: 'success',
                        message: 'Verification email sent! Please check your inbox.',
                    },
                });
            }
        } catch (error) {
            console.error(error);
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: error.message || 'Failed to send verification email',
                },
            });
        } finally {
            setSendingVerification(false);
        }
    };

    const handleUpdateName = async () => {
        const newName = nameRef.current.value;
        if (!newName || newName.trim().length < 2) {
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: 'Name must be at least 2 characters',
                },
            });
            return;
        }

        try {
            setLoading(true);
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: newName });

                // Also update in Firestore if you have a users collection syncing
                // Assuming a 'users' collection exists based on Login.js
                const userRef = doc(db, 'users', currentUser.uid || auth.currentUser.uid);
                // Try to update firestore, but don't fail if it doesn't exist or permission denied
                try {
                    await updateDoc(userRef, { fullName: newName });
                } catch (e) {
                    console.warn("Could not update firestore user doc", e);
                }

                // Update local context - this will trigger re-render
                const updatedUser = { ...currentUser, fullName: newName, displayName: newName };
                setCurrentUser(updatedUser);

                // Update storage
                sessionStorage.setItem('userData', JSON.stringify(updatedUser));
                localStorage.setItem('userData', JSON.stringify(updatedUser));

                dispatch({
                    type: 'UPDATE_ALERT',
                    payload: {
                        open: true,
                        severity: 'success',
                        message: 'Profile updated successfully',
                    },
                });
                setOpenNameDialog(false);
            }
        } catch (error) {
            console.error(error);
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: error.message,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        const newPassword = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (newPassword !== confirmPassword) {
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: 'Passwords do not match',
                },
            });
            return;
        }

        if (newPassword.length < 6) {
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: 'Password must be at least 6 characters',
                },
            });
            return;
        }

        try {
            setLoading(true);
            if (auth.currentUser) {
                await updatePassword(auth.currentUser, newPassword);
                dispatch({
                    type: 'UPDATE_ALERT',
                    payload: {
                        open: true,
                        severity: 'success',
                        message: 'Password updated successfully',
                    },
                });
                setOpenPasswordDialog(false);
            }
        } catch (error) {
            console.error(error);
            let msg = error.message;
            if (error.code === 'auth/requires-recent-login') {
                msg = 'Please log out and log back in to change your password for security.';
            }
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: msg,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                pt: { xs: 2, md: 3 },
                pb: { xs: 8, md: 10 },
                background: isDarkMode
                    ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        background: isDarkMode
                            ? alpha(theme.palette.background.paper, 0.6)
                            : alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: isDarkMode
                            ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                            : '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                    }}
                >
                    {/* Header Section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                mb: 2,
                                fontSize: '3rem',
                                bgcolor: theme.palette.primary.main,
                                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                                border: `4px solid ${theme.palette.background.paper}`,
                            }}
                            src={currentUser.photoURL}
                        >
                            {currentUser.fullName?.charAt(0).toUpperCase() || <Person />}
                        </Avatar>
                        <Typography variant="h4" fontWeight="700" gutterBottom>
                            {currentUser.fullName || 'User Profile'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage your account settings and preferences
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Full Name Section */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02),
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.03),
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            <Badge />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Full Name
                                            </Typography>
                                            <Typography variant="h6">
                                                {currentUser.fullName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={() => setOpenNameDialog(true)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Email Section (Read-only) */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02),
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    justifyContent: 'space-between',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                                color: theme.palette.info.main,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Email />
                                        </Box>
                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Email Address
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    wordBreak: 'break-word',
                                                    fontSize: { xs: '0.95rem', sm: '1.25rem' }
                                                }}
                                            >
                                                {currentUser.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {emailVerified ? (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                px: 2,
                                                py: 0.5,
                                                borderRadius: 10,
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                color: theme.palette.success.main,
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                            }}
                                        >
                                            Verified
                                        </Typography>
                                    ) : (
                                        <Button
                                            onClick={handleSendVerification}
                                            disabled={sendingVerification}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {sendingVerification ? <PulseLoader size={6} /> : 'Verify'}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Password Section */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02),
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        bgcolor: isDarkMode ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.03),
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                                color: theme.palette.error.main,
                                            }}
                                        >
                                            <Security />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Password
                                            </Typography>
                                            <Typography variant="h6" sx={{ letterSpacing: 3 }}>
                                                ••••••••
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={() => setOpenPasswordDialog(true)}
                                        color="error"
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Change
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* Edit Name Dialog */}
            <Dialog
                open={openNameDialog}
                onClose={() => setOpenNameDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        minWidth: { xs: 300, sm: 400 }
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Update Name</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Full Name"
                        type="text"
                        fullWidth
                        defaultValue={currentUser.fullName}
                        inputRef={nameRef}
                        variant="outlined"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenNameDialog(false)} color="inherit" sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateName}
                        variant="contained"
                        disabled={loading}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        {loading ? <PulseLoader size={8} color="#fff" /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog
                open={openPasswordDialog}
                onClose={() => setOpenPasswordDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        minWidth: { xs: 300, sm: 400 }
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Change Password</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Enter your new password below.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        inputRef={passwordRef}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        inputRef={confirmPasswordRef}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenPasswordDialog(false)} color="inherit" sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdatePassword}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        {loading ? <PulseLoader size={8} color="#fff" /> : 'Update Password'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserProfile;
