import React, { useState, useEffect } from 'react';
import { Google } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useValue } from '../../context/ContextProvider';
import { jwtDecode } from "jwt-decode";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth, collection, query, where, getDocs, addDoc, db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

const GoogleOneTapLogin = () => {
    const navigate = useNavigate();
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
            // Authenticate user with Firebase using Google credential
            const credential = GoogleAuthProvider.credential(token);
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;
    
            // Check if user already exists in Firestore
            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("uid", "==", user.uid));
            const userSnapshot = await getDocs(userQuery);
    
            // If user does not exist in Firestore, add them
            if (userSnapshot.empty) {
                const userData = {
                    uid: user.uid,
                    fullName: name,
                    email: email,
                    photoURL: photoURL,
                    google: true,
                };
    
                await addDoc(usersRef, userData); // Add user data to Firestore
    
                // Store user data in session and local storage
                sessionStorage.setItem("userData", JSON.stringify(userData));
                localStorage.setItem("userData", JSON.stringify(userData));
                dispatch({
                    type: "UPDATE_ALERT",
                    payload: {
                        open: true,
                        severity: "success",
                        message: "Google registration successful",
                    },
                });
                navigate("/");
            } else {
                // If user already exists, use their existing data
                const existingUserData = userSnapshot.docs[0].data();
                sessionStorage.setItem("userData", JSON.stringify(existingUserData));
                localStorage.setItem("userData", JSON.stringify(existingUserData));
            }
    
            navigate("/");
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
