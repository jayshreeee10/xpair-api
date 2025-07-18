import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

const Layout = () => {
  const location = useLocation();
  console.log('Current path:', location.pathname); // Add this for debugging

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            API Management Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/">
  Home
</Button>
<Button color="inherit" component={Link} to="/attributes">
  Manage Attributes
</Button>
<Button color="inherit" component={Link} to="/xpairs">
  Manage Xpairs
</Button>

        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;