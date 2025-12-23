import { Box, Button, Card, CardContent, Grid, Typography, Grow } from "@mui/material";
import React, { useState } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { NavLink } from 'react-router-dom';
import ProductCard from "../ProductCard";
import { useProductCardQuery } from "../../services/userAuthApi";


const Home = () => {

  const [expanded, setExpanded] = useState({});

  const { data: productCardData, isLoading: isProductCardLoading } =
    useProductCardQuery();

  if (isProductCardLoading) {
    return <div>Loading...</div>;
  }

  const toggle = (key, length) => {
    setExpanded((prev) => {
      const current = prev[key] || 12;
      if (current >= length) {
        return { ...prev, [key]: 12 };
      }
      return { ...prev, [key]: Math.min(current + 12, length) };
    });
  };

  const getShown = (key) => {
    const arr = productCardData?.[key] || [];
    const count = expanded[key] || 12;
    return arr.slice(0, count);
  };

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
            component={NavLink}
            to="/products"
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
            Add Products
          </Button>
        </Grid>
      </Grid>
    </Box>

    <Grow in timeout={600} style={{ transitionDelay: '80ms' }}>
      <div>
        <Typography
          variant="h4"
          sx={{ mt: 4, mb: 1, px: 3, fontWeight: '700', background: 'linear-gradient(90deg,#06b6d4,#2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}
        >
          Top Products
        </Typography>
        <Box sx={{ height: 6, width: 90, background: 'linear-gradient(90deg,#06b6d4,#2563eb)', borderRadius: 2, mt: 1, ml: 3 }} />
      </div>
    </Grow>

    <Grid container spacing={2} sx={{ px: 3, mt: 2 }}>
      {getShown('top_products')?.map((p) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={p.product_id || p.product_name}>
          <ProductCard product={p} />
        </Grid>
      ))}
    </Grid>
    {productCardData?.top_products?.length > 12 ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="outlined" onClick={() => toggle('top_products', productCardData.top_products.length)}>
          {((expanded['top_products'] || 12) >= productCardData.top_products.length) ? 'Show less' : 'Show more'}
        </Button>
      </Box>
    ) : null}

    {/* Computers & Accessories */}
    {productCardData?.computers_accessories?.length ? (
      <>
        <Grow in timeout={700} style={{ transitionDelay: '140ms' }}>
          <div>
            <Typography
              variant="h4"
              sx={{ mt: 6, mb: 1, px: 3, fontWeight: '700', background: 'linear-gradient(90deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}
            >
              Computers & Accessories
            </Typography>
            <Box sx={{ height: 6, width: 90, background: 'linear-gradient(90deg,#7c3aed,#ec4899)', borderRadius: 2, mt: 1, ml: 3 }} />
          </div>
        </Grow>
        <Grid container spacing={2} sx={{ px: 3 }}>
          {getShown('computers_accessories').map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.product_id || p.product_name}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
        {productCardData.computers_accessories.length > 12 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="outlined" onClick={() => toggle('computers_accessories', productCardData.computers_accessories.length)}>
              {((expanded['computers_accessories'] || 12) >= productCardData.computers_accessories.length) ? 'Show less' : 'Show more'}
            </Button>
          </Box>
        ) : null}
      </>
    ) : null}

    {/* Electronics Products */}
    {productCardData?.electronics_products?.length ? (
      <>
        <Grow in timeout={800} style={{ transitionDelay: '180ms' }}>
          <div>
            <Typography
              variant="h4"
              sx={{ mt: 6, mb: 1, px: 3, fontWeight: '700', background: 'linear-gradient(90deg,#f59e0b,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}
            >
              Electronics
            </Typography>
            <Box sx={{ height: 6, width: 90, background: 'linear-gradient(90deg,#f59e0b,#ef4444)', borderRadius: 2, mt: 1, ml: 3 }} />
          </div>
        </Grow>
        <Grid container spacing={2} sx={{ px: 3 }}>
          {getShown('electronics_products').map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.product_id || p.product_name}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
        {productCardData.electronics_products.length > 12 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="outlined" onClick={() => toggle('electronics_products', productCardData.electronics_products.length)}>
              {((expanded['electronics_products'] || 12) >= productCardData.electronics_products.length) ? 'Show less' : 'Show more'}
            </Button>
          </Box>
        ) : null}
      </>
    ) : null}

    {/* Home & Kitchen */}
    {productCardData?.home_kitchen?.length ? (
      <>
        <Grow in timeout={900} style={{ transitionDelay: '220ms' }}>
          <div>
            <Typography
              variant="h4"
              sx={{ mt: 6, mb: 1, px: 3, fontWeight: '700', background: 'linear-gradient(90deg,#10b981,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}
            >
              Home & Kitchen
            </Typography>
            <Box sx={{ height: 6, width: 90, background: 'linear-gradient(90deg,#10b981,#06b6d4)', borderRadius: 2, mt: 1, ml: 3 }} />
          </div>
        </Grow>
        <Grid container spacing={2} sx={{ px: 3 }}>
          {getShown('home_kitchen').map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.product_id || p.product_name}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
        {productCardData.home_kitchen.length > 12 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="outlined" onClick={() => toggle('home_kitchen', productCardData.home_kitchen.length)}>
              {((expanded['home_kitchen'] || 12) >= productCardData.home_kitchen.length) ? 'Show less' : 'Show more'}
            </Button>
          </Box>
        ) : null}
      </>
    ) : null}

    {/* Office Products */}
    {productCardData?.office_products?.length ? (
      <>
        <Grow in timeout={1000} style={{ transitionDelay: '260ms' }}>
          <div>
            <Typography
              variant="h4"
              sx={{ mt: 6, mb: 1, px: 3, fontWeight: '700', background: 'linear-gradient(90deg,#0ea5e9,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}
            >
              Office Products
            </Typography>
            <Box sx={{ height: 6, width: 90, background: 'linear-gradient(90deg,#0ea5e9,#7c3aed)', borderRadius: 2, mt: 1, ml: 3 }} />
          </div>
        </Grow>
        <Grid container spacing={2} sx={{ px: 3, mb: 6 }}>
          {getShown('office_products').map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.product_id || p.product_name}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
        {productCardData.office_products.length > 12 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 6 }}>
            <Button variant="outlined" onClick={() => toggle('office_products', productCardData.office_products.length)}>
              {((expanded['office_products'] || 12) >= productCardData.office_products.length) ? 'Show less' : 'Show more'}
            </Button>
          </Box>
        ) : null}
      </>
    ) : null}

  </>;
};

export default Home;
