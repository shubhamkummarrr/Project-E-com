import { TextField, Button, Box, Alert, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { setUserToken } from '../../../features/authSlice';
import { getToken, storeToken } from '../../../services/LocalStorageService';
import { useLoginUserMutation } from '../../../services/userAuthApi';

const UserLogin = () => {
  const [server_error, setServerError] = useState({})
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    if (res.error) {
      // console.log(typeof (res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      // console.log(typeof (res.data))
      // console.log(res.data)
      storeToken(res.data.token)
      let { access_token } = getToken()
      dispatch(setUserToken({ access_token: access_token }))
      navigate('/dashboard')
    }
  }
  let { access_token } = getToken()
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }))
  }, [access_token, dispatch])


  return <>
    <Box component='form' 
      noValidate 
      sx={{ 
        mt: 1,
        '& .MuiTextField-root': { mb: 2 },
      }} 
      id='login-form' 
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Welcome Back
      </Typography>
      
      <TextField
        required
        fullWidth
        id='email'
        name='email'
        label='Email Address'
        autoComplete='email'
        autoFocus
        error={Boolean(server_error.email)}
        helperText={server_error.email ? server_error.email[0] : ''}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
      
      <TextField
        required
        fullWidth
        id='password'
        name='password'
        label='Password'
        type='password'
        autoComplete='current-password'
        error={Boolean(server_error.password)}
        helperText={server_error.password ? server_error.password[0] : ''}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={isLoading}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>

      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <NavLink 
          to='/sendpasswordresetemail'
          style={{
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Forgot Password?
        </NavLink>
      </Box>

      {server_error.non_field_errors && (
        <Alert 
          severity='error' 
          sx={{ 
            mt: 2,
            '& .MuiAlert-message': {
              fontSize: '0.9rem'
            }
          }}
        >
          {server_error.non_field_errors[0]}
        </Alert>
      )}
    </Box>
  </>;
};

export default UserLogin;
