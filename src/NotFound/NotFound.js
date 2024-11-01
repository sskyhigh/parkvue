import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = ({ information }) => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="top"
      height="100vh"
      bgcolor="#f5f5f5"
      textAlign="center"
      padding={1}
    >
      <Typography variant="h1" component="h2" color="primary">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" paragraph>
        The { information? information : "page" } you are looking for might have been removed or is temporarily unavailable.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')}
      >
        Go Back to Home
      </Button>
    </Box>
  );
};

export default NotFound;
