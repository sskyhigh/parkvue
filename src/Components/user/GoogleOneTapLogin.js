import React, { useState, useEffect } from 'react';
import { Google } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useValue } from '../../context/ContextProvider';
import { jwtDecode } from "jwt-decode";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../firebase/config';

const GoogleOneTapLogin = () => {
    const { dispatch } = useValue();
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (!window.google) return; // Ensures google object is available

        // Initialize Google One Tap
        window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleResponse,
            auto_select: true, // Auto-select if user has previously logged in
        });

        // Prompt One Tap immediately
        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
                console.error('One Tap prompt not displayed:', notification.getNotDisplayedReason());
            }
        });
    }, []);

    const handleResponse = async (response) => {
        const token = response.credential;
        const decodedToken = jwtDecode(token);
        const { sub: id, email, name, picture: photoURL } = decodedToken;

        try {
            const credential = GoogleAuthProvider.credential(token);
            const userCredential = await signInWithCredential(auth, credential);

            // Store user data with Firebase User UID
            dispatch({
                type: 'UPDATE_USER',
                payload: {
                    id: userCredential.user.uid,
                    email,
                    name,
                    photoURL,
                    token,
                    google: true,
                },
            });

            dispatch({ type: 'CLOSE_LOGIN' });
        } catch (error) {
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: error.message,
                },
            });
            console.error('Google Login Error:', error);
        } finally {
            setDisabled(false);
        }
    };

    const handleGoogleLogin = () => {
        setDisabled(true);
        try {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed()) {
                    dispatch({
                        type: 'UPDATE_ALERT',
                        payload: { open: true, severity: 'error', message: "Couldn't open Goolge one tap login" },
                    });
                    return;
                }
                if (notification.isSkippedMoment() || notification.isDismissedMoment()) {
                    setDisabled(false);
                }
            });
        } catch (error) {
            dispatch({
                type: 'UPDATE_ALERT',
                payload: { open: true, severity: 'error', message: error.message },
            });
            setDisabled(false);
        }
    };

    return (
        <Button
            variant="outlined"
            startIcon={<Google />}
            disabled={disabled}
            onClick={handleGoogleLogin}
        >
            Login with Google
        </Button>
    );
};

export default GoogleOneTapLogin;
