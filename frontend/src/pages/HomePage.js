import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent,
  Container
} from '@mui/material';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const features = [
    {
      title: 'Manage Attributes',
      description: 'Create, view, and modify attributes',
      path: '/attributes',
      className: 'attribute-card'
    },
    {
      title: 'Manage Xpairs',
      description: 'Create, view, and modify xpairs',
      path: '/xpairs',
      className: 'xpair-card'
    }
  ];

  return (
    <Container maxWidth="md" className="homepage-container">
      <Box>
        <Typography variant="h3" className="homepage-title" gutterBottom>
          Welcome !
        </Typography>
        {/* <Typography variant="h6" className="homepage-subtitle">
          Select an option below to get started
        </Typography> */}
      </Box>

      <Grid container spacing={4} className="feature-grid">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={`feature-card ${feature.className}`}>
              <CardActionArea 
                component={Link} 
                to={feature.path}
                className="feature-card-content"
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;