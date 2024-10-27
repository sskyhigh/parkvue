import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { useValue } from '../context/ContextProvider';

const Notification = () => {
    const {
        state: { alert },
        dispatch,
    } = useValue();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return; //user chooses to close alert
        dispatch({ type: 'UPDATE_ALERT', payload: {...alert, open: false } });
    };
    return (
        <Snackbar //toggle
            open={alert.open} //global variable from context provider
            autoHideDuration={6000} //6sec. duration
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} //position
        >
            {/* Alert message properties */}
            <Alert
                onClose={handleClose}
                severity={alert.severity}
                sx={{ width: '100%' }}
                variant="filled"
                elevation={6} //shadow design
            >
                {alert.message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;