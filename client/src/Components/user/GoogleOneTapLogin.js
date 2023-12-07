import { Google } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import {jwtDecode} from "jwt-decode";

const GoogleOneTapLogin = () => {
    const { dispatch } = useValue(); //show error to user; false = enabled button
    const [disabled, setDisabled] = useState(false);

    const handleResponse = (response) => { //handle to receive googles response
        const token = response.credential //extract token response from google credential
        const decodedToken = jwtDecode(token) //jwt function use to decode
        console.log(decodedToken); //see information received
    };

    const handleGoogleLogin = () => {
        setDisabled(true); //disabled button avoids multiple login attempts when clicked
        try {
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, //bring client id from environment variable
                callback:handleResponse, //handle response from google
            });
        //    prompt pop up window to receive notification
            window.google.accounts.id.prompt((notification) => {
                if(notification.isNotDisplayed()) { //No display if prompt isn't working (2hr. reset) to not annoy user
                    throw new Error('Try to clear the cookies or try again later!');
                }
                //close when user clicks outside prompt then re-enables button
                if(notification.isSkippedMoment() || notification.isDismissedMoment()
                ) {
                    setDisabled(false);
                }
            });
        } catch (error) { //update user
            dispatch({
                type: 'UPDATE_ALERT',
                payload: { open: true, severity: 'error', message: error.message},
        });
            console.log(error);
        }
    };

    return (
        <Button
            variant = "outlined" //Box around google button
            startIcon= {<Google />}
            //control the state of button
            disabled = { disabled }
            onClick={handleGoogleLogin}//control the state of the button
       >
            Login with Google
        </Button>
    );
};

export default GoogleOneTapLogin;