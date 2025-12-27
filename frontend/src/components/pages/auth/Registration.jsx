import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../../services/userAuthApi'
import { storeToken } from '../../../services/LocalStorageService';

const Registration = () => {
  const [server_error, setServerError] = useState({})
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation()
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      password2: data.get('password2'),
      tc: data.get('tc'),
    }
    const res = await registerUser(actualData)
    if (res.error) {
      // console.log(typeof (res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      console.log(typeof (res.data))
      console.log(res.data)
      storeToken(res.data.token)
      navigate('/Profile')
    }
  }
  return <>
    {/* {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
    {server_error.name ? console.log(server_error.name[0]) : ""}
    {server_error.email ? console.log(server_error.email[0]) : ""}
    {server_error.password ? console.log(server_error.password[0]) : ""}
    {server_error.password2 ? console.log(server_error.password2[0]) : ""}
    {server_error.tc ? console.log(server_error.tc[0]) : ""} */}
    <Box 
      component='form' 
      noValidate 
      sx={{ 
        mt: 1,
        '& .MuiTextField-root': { mb: 2 },
      }} 
      id='registration-form' 
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Create Account
      </Typography>

      <TextField
        required
        fullWidth
        id='name'
        name='name'
        label='Full Name'
        autoComplete='name'
        error={Boolean(server_error.name)}
        helperText={server_error.name ? server_error.name[0] : ''}
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
        id='email'
        name='email'
        label='Email Address'
        autoComplete='email'
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
        type={showPassword ? 'text' : 'password'}
        error={Boolean(server_error.password)}
        helperText={server_error.password ? server_error.password[0] : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
        id='password2'
        name='password2'
        label='Confirm Password'
        type={showConfirmPassword ? 'text' : 'password'}
        error={Boolean(server_error.password2)}
        helperText={server_error.password2 ? server_error.password2[0] : ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <FormControlLabel
        control={
          <Checkbox 
            value={true} 
            color="primary" 
            name="tc" 
            id="tc"
            sx={{
              '&.Mui-checked': {
                color: 'primary.main',
              },
            }}
          />
        }
        label={
          <Typography variant="body2">
            I agree to the Terms and Conditions
          </Typography>
        }
      />
      {server_error.tc && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ display: 'block', mt: -1, mb: 2 }}
        >
          {server_error.tc[0]}
        </Typography>
      )}

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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
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

export default Registration;
