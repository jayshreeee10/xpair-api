import React from 'react';
import { Typography, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to API Management Dashboard
      </Typography>
      <Typography variant="body1">
        Use the navigation menu to manage attributes and xpairs.
      </Typography>
    </Box>
  );
};

export default HomePage;