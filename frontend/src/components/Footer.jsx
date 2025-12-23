import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: 8,
      py: 6,
      backgroundColor: 'background.paper',
      borderTop: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Container maxWidth="xl">
      <Grid container spacing={4}>
        
        {/* Company Info */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Hackveda
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
            Hackveda is a technology-driven platform focused on delivering
            high-quality tech products, learning resources, and innovation-led
            solutions. We aim to make advanced technology accessible, reliable,
            and practical for everyone.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            <Link component={NavLink} to="/products" underline="none" color="text.secondary">
              Products
            </Link>
            <Link component={NavLink} to="/contact" underline="none" color="text.secondary">
              Contact Us
            </Link>
            <Link component={NavLink} to="/about" underline="none" color="text.secondary">
              About Us
            </Link>
          </Box>
        </Grid>

        {/* Support */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Support
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: support@hackveda.in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phone: +91 XXXXX XXXXX
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Support Hours: Mon – Sat, 10:00 AM – 6:00 PM
          </Typography>
        </Grid>

      </Grid>

      {/* Bottom Bar */}
      <Box
        sx={{
          mt: 4,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Hackveda. All rights reserved.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Built with reliability, security, and innovation in mind.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;
