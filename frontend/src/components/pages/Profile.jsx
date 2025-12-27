import { Box, Button, CssBaseline, Grid, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from "../../features/authSlice";
import { getToken, removeToken } from "../../services/LocalStorageService";
import ChangePassword from './auth/ChangePassword';
import { useGetLoggedUserQuery } from "../../services/userAuthApi";
import { useEffect, useState } from 'react';
import { setUserInfo, unsetUserInfo } from "../../features/userSlice";
import Navbar from '../Navbar';


const Profile = () => {
  const handleLogout = () => {
    dispatch(unsetUserInfo({ name: "", email: "" }))
    dispatch(unSetUserToken({ access_token: null }))
    removeToken()
    navigate('/login')
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { access_token } = getToken()
  const { data, isSuccess } = useGetLoggedUserQuery(access_token)

  const [userData, setUserData] = useState({
    email: "",
    name: ""
  })

  // Store User Data in Local State
  useEffect(() => {
    if (data && isSuccess) {
      setUserData({
        email: data.email,
        name: data.name,
      })
    }
  }, [data, isSuccess])

  // Store User Data in Redux Store
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUserInfo({
        email: data.email,
        name: data.name
      }))
    }
  }, [data, isSuccess, dispatch])

  return <>
    <CssBaseline />
    <Navbar/>
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} md={4}>
        <Box sx={{ 
          backgroundColor: 'primary.dark',
          borderRadius: 2,
          p: 3,
          color: 'white',
          boxShadow: 3
        }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Welcome Back!</Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant='subtitle1' sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>Email</Typography>
            <Typography variant='h6'>{userData.email}</Typography>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant='subtitle1' sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>Name</Typography>
            <Typography variant='h6'>{userData.name}</Typography>
          </Box>
          <Button 
            variant='contained' 
            color='error'
            size='large' 
            onClick={handleLogout}
            fullWidth
            sx={{ 
              mt: 2,
              backgroundColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.dark',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Box sx={{ 
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 3,
          boxShadow: 3
        }}>
          <ChangePassword />
        </Box>
      </Grid>
    </Grid>
  </>;
};

export default Profile;
