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
    useMediaQuery,
    alpha,
    Alert,
    IconButton,
    Collapse,
} from '@mui/material';
import {
    Edit,
    Person,
    Email,
    Security,
    Badge,
    LocationOn,
    Description,
    Close,
    PhotoCamera,
} from '@mui/icons-material';
import { useValue, Context } from '../../context/ContextProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProfile, updatePassword, sendEmailVerification } from 'firebase/auth';
import { auth, db, doc, updateDoc, collection, query, where, getDocs } from '../../firebase/config';
import { PulseLoader } from 'react-spinners';
import uploadFileProgress from '../../firebase/uploadFileProgress';

const DIALOG_TYPES = {
    NONE: null,
    NAME: 'name',
    PASSWORD: 'password',
    LOCATION: 'location',
    DESCRIPTION: 'description',
};

const UserProfile = () => {
    const { dispatch } = useValue();
    const { currentUser, setCurrentUser } = useContext(Context);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';
    const navigate = useNavigate();
    const location = useLocation();

    const [openDialog, setOpenDialog] = useState(DIALOG_TYPES.NONE);
    const [loading, setLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(auth?.currentUser?.emailVerified || false);
    const [sendingVerification, setSendingVerification] = useState(false);
    const [dismissedWarning, setDismissedWarning] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userDocId, setUserDocId] = useState(null);
    const [profileLoaded, setProfileLoaded] = useState(false);

    const nameRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const addressRef = useRef();
    const cityRef = useRef();
    const stateRef = useRef();
    const descriptionRef = useRef();
    const fileInputRef = useRef();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', {
                state: { redirectTo: location.pathname + location.search },
                replace: true,
            });
            return;
        }
        
        // Only fetch user data once on mount, not on every currentUser change
        // This prevents re-fetching and restoring user data after logout
        const fetchUserData = async () => {
            try {
                const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const data = userDoc.data();
                    setUserData(data);
                    setUserDocId(userDoc.id);
                    
                    // Only update if storage data exists (prevents restoration after logout)
                    const storageData = sessionStorage.getItem('userData') || localStorage.getItem('userData');
                    if (storageData) {
                        const updatedUser = { ...currentUser, ...data };
                        setCurrentUser(updatedUser);
                        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
                        localStorage.setItem('userData', JSON.stringify(updatedUser));
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setProfileLoaded(true);
            }
        };
        
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]); // Only run on mount and when navigate changes

    // Check email verification status
    useEffect(() => {
        const checkVerification = async () => {
            if (auth?.currentUser) {
                await auth.currentUser.reload();
                setEmailVerified(auth?.currentUser?.emailVerified);
            }
        };

        // Check immediately
        checkVerification();

        // Check every 5 seconds if not verified
        const interval = setInterval(() => {
            if (!emailVerified && auth?.currentUser) {
                checkVerification();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [emailVerified]);

    const isProfileComplete = () => {
    const fields = [
        currentUser?.fullName,
        currentUser?.photoURL,
        userData?.address,
        userData?.city,
        userData?.state,
        userData?.description,
    ];

        return fields.every(
            v => typeof v === "string" ? v.trim() !== "" : Boolean(v)
        );
    };

    const handleSendVerification = async () => {
        try {
            setSendingVerification(true);
            if (auth?.currentUser && !auth?.currentUser?.emailVerified) {
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
            if (auth?.currentUser) {
                await updateProfile(auth.currentUser, { displayName: newName });

                // Also update in Firestore if you have a users collection syncing
                // Assuming a 'users' collection exists based on Login.js
                if (userDocId) {
                    const userRef = doc(db, 'users', userDocId);
                    // Try to update firestore, but don't fail if it doesn't exist or permission denied
                    try {
                        await updateDoc(userRef, { fullName: newName });
                    } catch (e) {
                        console.warn("Could not update firestore user doc", e);
                    }
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
                setOpenDialog(DIALOG_TYPES.NONE);
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
            if (auth?.currentUser) {
                await updatePassword(auth.currentUser, newPassword);
                dispatch({
                    type: 'UPDATE_ALERT',
                    payload: {
                        open: true,
                        severity: 'success',
                        message: 'Password updated successfully',
                    },
                });
                setOpenDialog(DIALOG_TYPES.NONE);
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

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploadingPhoto(true);
            const imageName = `${Date.now()}-${file.name}`;
            const subFolder = 'profilePictures';
            const photoURL = await uploadFileProgress(file, subFolder, imageName, () => {});

            if (auth?.currentUser) {
                await updateProfile(auth.currentUser, { photoURL });

                // Update in Firestore
                if (userDocId) {
                    const userRef = doc(db, 'users', userDocId);
                    await updateDoc(userRef, { photoURL });
                }

                // Update local state
                const updatedUser = { ...currentUser, photoURL };
                setCurrentUser(updatedUser);
                sessionStorage.setItem('userData', JSON.stringify(updatedUser));
                localStorage.setItem('userData', JSON.stringify(updatedUser));

                dispatch({
                    type: 'UPDATE_ALERT',
                    payload: {
                        open: true,
                        severity: 'success',
                        message: 'Profile picture updated successfully',
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
                    message: error.message || 'Failed to update profile picture',
                },
            });
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleUpdateLocation = async () => {
        const address = addressRef.current.value;
        const city = cityRef.current.value;
        const state = stateRef.current.value;

        if (!address || !city || !state) {
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: 'All location fields are required',
                },
            });
            return;
        }

        try {
            setLoading(true);
            if (!userDocId) {
                throw new Error('User document not found');
            }
            const userRef = doc(db, 'users', userDocId);
            await updateDoc(userRef, { address, city, state });

            // Update local state
            const updatedUser = { ...currentUser, address, city, state };
            setCurrentUser(updatedUser);
            setUserData({ ...userData, address, city, state });
            sessionStorage.setItem('userData', JSON.stringify(updatedUser));
            localStorage.setItem('userData', JSON.stringify(updatedUser));

            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'success',
                    message: 'Location updated successfully',
                },
            });
            setOpenDialog(DIALOG_TYPES.NONE);
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

    const handleUpdateDescription = async () => {
        const description = descriptionRef.current.value;

        if (!description || description.trim().length < 10) {
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: 'Description must be at least 10 characters',
                },
            });
            return;
        }

        try {
            setLoading(true);
            if (!userDocId) {
                throw new Error('User document not found');
            }
            const userRef = doc(db, 'users', userDocId);
            await updateDoc(userRef, { description });

            // Update local state
            const updatedUser = { ...currentUser, description };
            setCurrentUser(updatedUser);
            setUserData({ ...userData, description });
            sessionStorage.setItem('userData', JSON.stringify(updatedUser));
            localStorage.setItem('userData', JSON.stringify(updatedUser));

            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'success',
                    message: 'Description updated successfully',
                },
            });
            setOpenDialog(DIALOG_TYPES.NONE);
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

    const openDialogHandler = (dialogType) => () => {
        setOpenDialog(dialogType);
    };

    const closeDialogHandler = () => {
        setOpenDialog(DIALOG_TYPES.NONE);
    };

    if (!currentUser) return null;

    return (
        <Box
            sx={{
                minHeight: 'auto',
                pt: 2,
                pb: 4,
                background: theme.palette.background.default,
            }}
        >
            <Container maxWidth="md">
                <Collapse in={profileLoaded && !isProfileComplete() && !dismissedWarning}>
                    <Alert
                        severity="warning"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setDismissedWarning(true)}
                            >
                                <Close fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Complete your profile to get the best experience on Parkvue.
                    </Alert>
                </Collapse>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        background: theme.palette.background.paper,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: theme.customStyles.cardGlass.boxShadow,
                    }}
                >
                    {/* Header Section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
                        <Box sx={{ position: 'relative' }}>
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
                                src={currentUser?.photoURL}
                            >
                                {currentUser?.fullName?.charAt(0)?.toUpperCase() || <Person />}
                            </Avatar>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    right: 0,
                                    bgcolor: theme.palette.primary.main,
                                    color: 'white',
                                    '&:hover': { bgcolor: theme.palette.primary.dark },
                                }}
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploadingPhoto}
                            >
                                {uploadingPhoto ? <PulseLoader size={6} /> : <PhotoCamera fontSize="small" />}
                            </IconButton>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                        </Box>
                        <Typography variant="h4" fontWeight="700" gutterBottom>
                            {currentUser?.fullName || 'User Profile'}
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
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
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Full Name
                                            </Typography>
                                            <Typography variant="h6">
                                                {currentUser?.fullName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={openDialogHandler(DIALOG_TYPES.NAME)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            alignSelf: { xs: 'flex-end', sm: 'auto' },
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
                                                {currentUser?.email}
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
                                                alignSelf: { xs: 'flex-end', sm: 'auto' },
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
                                                alignSelf: { xs: 'flex-end', sm: 'auto' },
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
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
                                        <Box sx={{ minWidth: 0 }}>
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
                                        onClick={openDialogHandler(DIALOG_TYPES.PASSWORD)}
                                        color="error"
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            alignSelf: { xs: 'flex-end', sm: 'auto' },
                                        }}
                                    >
                                        Change
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Location Section */}
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                color: theme.palette.secondary.main,
                                            }}
                                        >
                                            <LocationOn />
                                        </Box>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Location
                                            </Typography>
                                            <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                                                {userData?.address ? `${userData?.address}, ${userData?.city}, ${userData?.state}` : 'Not set'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={openDialogHandler(DIALOG_TYPES.LOCATION)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            alignSelf: { xs: 'flex-end', sm: 'auto' },
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Profile Description Section */}
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
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        justifyContent: 'space-between',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                color: theme.palette.warning.main,
                                            }}
                                        >
                                            <Description />
                                        </Box>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                Profile Description
                                            </Typography>
                                            <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                                                {userData?.description || 'Not set'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={openDialogHandler(DIALOG_TYPES.DESCRIPTION)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            alignSelf: { xs: 'flex-end', sm: 'auto' },
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            {/* Consolidated Dialog Component */}
            <Dialog
                open={openDialog !== DIALOG_TYPES.NONE}
                onClose={closeDialogHandler}
                fullWidth
                maxWidth="sm"
                scroll="paper"
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 3,
                        p: 1,
                        width: '100%',
                        m: isMobile ? 0 : 2,
                    }
                }}
            >
                {/* Dialog Title based on type */}
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {openDialog === DIALOG_TYPES.NAME && 'Update Name'}
                    {openDialog === DIALOG_TYPES.PASSWORD && 'Change Password'}
                    {openDialog === DIALOG_TYPES.LOCATION && 'Update Location'}
                    {openDialog === DIALOG_TYPES.DESCRIPTION && 'Update Profile Description'}
                </DialogTitle>
                
                <DialogContent
                    sx={{
                        pt: 1,
                        pb: 1,
                    }}
                >
                    {/* Name Dialog Content */}
                    {openDialog === DIALOG_TYPES.NAME && (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Full Name"
                            type="text"
                            fullWidth
                            defaultValue={currentUser?.fullName}
                            inputRef={nameRef}
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    )}

                    {/* Password Dialog Content */}
                    {openDialog === DIALOG_TYPES.PASSWORD && (
                        <>
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
                        </>
                    )}

                    {/* Location Dialog Content */}
                    {openDialog === DIALOG_TYPES.LOCATION && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Address"
                                type="text"
                                fullWidth
                                defaultValue={userData?.address}
                                inputRef={addressRef}
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="City"
                                type="text"
                                fullWidth
                                defaultValue={userData?.city}
                                inputRef={cityRef}
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="State"
                                type="text"
                                fullWidth
                                defaultValue={userData?.state}
                                inputRef={stateRef}
                                variant="outlined"
                            />
                        </>
                    )}

                    {/* Description Dialog Content */}
                    {openDialog === DIALOG_TYPES.DESCRIPTION && (
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            defaultValue={userData?.description}
                            inputRef={descriptionRef}
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    )}
                </DialogContent>
                
                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 1,
                        '& > :not(style) ~ :not(style)': {
                            ml: { xs: 0, sm: 1 },
                            mt: { xs: 1, sm: 0 },
                        },
                    }}
                >
                    <Button
                        onClick={closeDialogHandler}
                        variant="contained"
                        color="inherit"
                        fullWidth={isMobile}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            switch (openDialog) {
                                case DIALOG_TYPES.NAME:
                                    return handleUpdateName();
                                case DIALOG_TYPES.PASSWORD:
                                    return handleUpdatePassword();
                                case DIALOG_TYPES.LOCATION:
                                    return handleUpdateLocation();
                                case DIALOG_TYPES.DESCRIPTION:
                                    return handleUpdateDescription();
                                default:
                                    return;
                            }
                        }}
                        variant="contained"
                        disabled={loading}
                        fullWidth={isMobile}
                        sx={{ borderRadius: 2, px: 3, minWidth: { sm: 160 } }}
                    >
                        {loading ? <PulseLoader size={8} color="#fff" /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserProfile;