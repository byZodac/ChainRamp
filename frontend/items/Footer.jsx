import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3, 
        mt: 'auto', 
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {currentYear} ChainRamp. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;