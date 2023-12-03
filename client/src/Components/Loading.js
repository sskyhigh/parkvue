import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import { useValue } from '../context/ContextProvider';

const Loading = () => {
    const {state: { loading }} = useValue();

    return (
        <Backdrop
            //{}: closed since default value is false
            open={loading}
            //zIndex gives it priority with default them for model
            sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
            {/* infinite circle to represent progress */}
            <CircularProgress sx={{ color: 'white' }} />
        </Backdrop>
    );
};

export default Loading;