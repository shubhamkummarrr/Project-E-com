import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Container } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { getToken } from '../services/LocalStorageService';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../features/cartSlice';



const Navbar = () => {
  const { access_token } = getToken()
  const [cartOpen, setCartOpen] = useState(false)
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate('/buyproducts')
    setCartOpen(false);
  };

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
                to='/Profile'
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
                Profile
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

            <Button onClick={() => setCartOpen(o => !o)} style={{ position: "relative" }}>
              <img src="/grocery.gif" style={{ height: "40px" }} />
              <span style={{
                position: "absolute",
                top: -5,
                right: -6,
                background: "#6b3deaff",
                color: "white",
                borderRadius: "50%",
                padding: "4px 7px",
                fontSize: "12px",
                fontWeight: "bold"
              }}>{cartItems.reduce((sum, it) => sum + (it.qty || 1), 0)}</span>
            </Button>

            {cartOpen && (
              <div style={{
                position: 'fixed',
                top: 72,
                right: 20,
                width: 340,
                maxWidth: '90vw',
                background: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                borderRadius: 8,
                zIndex: 1400,
                padding: 12,
                height: "60vh",
                overflowY: 'auto'

              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong>Your Cart</strong>
                  <Button onClick={() => setCartOpen(false)} size="small">Close</Button>
                </div>

                <div>
                  {cartItems.length === 0 && (
                    <div style={{ padding: 12, color: '#666' }}>Your cart is empty</div>
                  )}

                  {cartItems.map(p => (
                    <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', color: "black", borderBottom: '1px solid #eee' }}>
                      <img
                        src={p.img_link}
                        alt={p.product_name}
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: "contain",
                          borderRadius: 6,
                          background: "#f5f5f5",
                          padding: 4
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          if {p.product_name.length > 30 ? p.product_name.substring(0, 30) + '...' : p.product_name}
                        </div>
                        <div style={{ fontSize: 13, color: '#666' }}>₹{(Number(p.discounted_price) || 0).toFixed(2)}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap:3 }}>
                        <div style={{ fontSize: 13, color: '#333', marginBottom: 6 }}>x{p.qty || 1}</div>
                        <Button size="small" variant="outlined" style={{ color: "#34ce51", border: "2px solid #34ce51" }} onClick={() => dispatch(addToCart(p))}>+</Button>
                        <Button size="small" variant="outlined" style={{ color: "red", border: "1px solid red" }} onClick={() => dispatch(removeFromCart(p.id))}>-</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: "black" }}>
                  <div style={{ fontWeight: 700 }}>Subtotal</div>
                  <div style={{ fontWeight: 700 }}>{cartItems.reduce((s, p) => s + (Number(p.discounted_price) || 0) * (p.qty || 1), 0).toFixed(2)}</div>
                </div>
                <div>
                  <button onClick={handleBuy} style={{
                    marginTop: 12,
                    width: '40%',
                    padding: '10px 0',
                    backgroundColor: '#389544',
                    color: 'white',
                    border: '2px solid #389544',
                    borderRadius: 6,
                  }}>
                    Buy Now
                  </button>
                </div>
              </div>
            )}

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
