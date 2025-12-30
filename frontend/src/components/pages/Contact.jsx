import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useContactUsMutation } from "../../services/userAuthApi";


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [contactUs] = useContactUsMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    contactUs(formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  


  return <>
    <Grid container justifyContent='center' sx={{ p: 3 }}>
      <Grid item xs={12} md={8} lg={6}>
        <Box sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 4,
          boxShadow: 3
        }}>
          <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Your Name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }

              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="message"
              label="Your Message"
              multiline
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }

              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </>;
};

export default Contact;
