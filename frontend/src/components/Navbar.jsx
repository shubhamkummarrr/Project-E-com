import { AppBar, Box, Toolbar, Typography, Button, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { getToken } from '../services/LocalStorageService';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Navbar = () => {
  const { access_token } = getToken()
  return (
    <AppBar position="sticky" sx={{
      top: 0,
      zIndex: (theme) => theme.zIndex.appBar + 10,
      backgroundColor: "#ffffffff",
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ShoppingBagIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            Hackveda
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <ShoppingBagIcon sx={{ color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                ml: 1,
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              Hackveda
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={NavLink}
              to='/'
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : '',
                color: isActive ? 'primary.main' : 'text.primary'
              })}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Home
            </Button>

            <Button
              component={NavLink}
              to='/contact'
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : '',
                color: isActive ? 'primary.main' : 'text.primary'
              })}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Contact
            </Button>

            {access_token ?
              <Button
                component={NavLink}
                to='/dashboard'
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'rgba(0, 0, 0, 0.04)' : '',
                  color: isActive ? 'primary.main' : 'text.primary'
                })}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Dashboard
              </Button>
              :
              <Button
                component={NavLink}
                to='/login'
                variant="contained"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                Login/Registration
              </Button>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
