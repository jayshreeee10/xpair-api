import React from 'react';
import { Box, Typography } from '@mui/material';

const JsonPreview = ({ data }) => {
  return (
   <Box
  sx={{
    mt: 2,
    p: 2,
    border: '1px solid #ccc',
    borderRadius: 2,
    backgroundColor: '#f6f8fa',
    fontFamily: 'monospace',
    fontSize: '14px',
    overflowX: 'auto',
    whiteSpace: 'pre',
    maxHeight: 400,
  }}
>
  <Typography variant="h6" gutterBottom>
    Live JSON Preview
  </Typography>
  <pre>{JSON.stringify(data, null, 2)}</pre>
</Box>

  );
};

export default JsonPreview;
