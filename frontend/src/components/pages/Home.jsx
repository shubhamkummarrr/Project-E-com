import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Home = () => {
  return <>
    <Box sx={{ 
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      py: 8,
      mb: 6
    }}>
      <Grid container justifyContent='center' sx={{ px: 3 }}>
        <Grid item xs={12} md={8} textAlign="center">
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold',
            mb: 4
          }}>
            Welcome to Hackveda
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
            Your One-Stop Shop for All Things Tech
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<ShoppingCartIcon />}
            sx={{ 
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            Start Shopping
          </Button>
        </Grid>
      </Grid>
    </Box>

    <Grid container spacing={4} sx={{ px: 3, mb: 6 }}>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <CardContent>
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Wide Selection
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse through thousands of tech products from top brands at competitive prices.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <CardContent>
            <LocalShippingIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Fast Delivery
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get your orders delivered quickly and securely to your doorstep.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
          <CardContent>
            <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              24/7 Support
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our customer support team is always ready to help you with any queries.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </>;
};

export default Home;
