import {
  Box,
  Button,
  CssBaseline,
  Grid,
  Typography,
  Avatar,
  Divider,
  Paper,
  Card,
  CardContent,
  Container
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { unSetUserToken } from "../../features/authSlice";
import { removeToken, getToken } from "../../services/LocalStorageService";
import ChangePassword from "./auth/ChangePassword";
import {
  useGetLoggedUserQuery,
  useUserGetDetailsQuery,
  // useUserPutDetailsMutation
} from "../../services/userAuthApi";
import { useEffect, useState } from "react";
import { setUserInfo, unsetUserInfo } from "../../features/userSlice";
import Navbar from "../Navbar";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  // City,
  Apartment,
  Pin
} from "@mui/icons-material";
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { access_token } = getToken();

  const { data, isSuccess } = useGetLoggedUserQuery(access_token);
  const { data: userDetails } = useUserGetDetailsQuery(access_token);

  const details = userDetails?.[0]; // ✅ backend returns array

  const [userData, setUserData] = useState({
    email: "",
    name: "",
  });

  // Logout
  const handleLogout = () => {
    dispatch(unsetUserInfo());
    dispatch(unSetUserToken({ access_token: null }));
    removeToken();
    navigate("/login");
  };

  // Local + Redux user info
  useEffect(() => {
    if (data && isSuccess) {
      setUserData({
        email: data.email,
        name: data.name,
      });

      dispatch(
        setUserInfo({
          email: data.email,
          name: data.name,
        })
      );
    }
  }, [data, isSuccess, dispatch]);

  const handlePut = async () => {
    const updateData = {
      address_line: "123 New St",
      city: "New City",
      state: "New State",
      pincode: "123456",
      mobile_number: "9876543210",
      user_full_name: userData.name,
    };

    try {
      const response = await putDetails(updateData).unwrap();
      console.log("User details updated:", response);
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
  };

  return (
    <>
      <CssBaseline />
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" sx={{
          mb: 4,
          fontWeight: 700,
          color: "primary.main",
          textAlign: { xs: "center", md: "left" }
        }}>
          My Profile
        </Typography>

        <Grid container spacing={3}>
          {/* LEFT PANEL - User Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
              height: "60vh",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
              }
            }}>
              <Box sx={{
                bgcolor: "primary.main",
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)"
              }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "white",
                    color: "primary.main",
                    fontSize: 40,
                    fontWeight: 600,
                    border: "4px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                  }}
                >
                  {userData.name?.[0]?.toUpperCase()}
                </Avatar>

                <Typography variant="h5" sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 0.5
                }}>
                  {userData.name}
                </Typography>
                <Typography sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "0.9rem"
                }}>
                  {userData.email}
                </Typography>
              </Box>

              <CardContent sx={{
                p: 3,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column"
              }}>
                {details?.mobile_number && (
                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 1.5,
                    bgcolor: "rgba(25, 118, 210, 0.05)",
                    borderRadius: 2
                  }}>
                    <Phone sx={{ mr: 1.5, color: "primary.main", fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 500 }}>
                      {details.mobile_number}
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{
                    mt: "auto",
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(244, 67, 54, 0.3)"
                    }
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT PANEL - Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid rgba(0,0,0,0.05)",
              height: "100%"
            }}>
              {/* Personal Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}>
                  <Person sx={{ color: "primary.main" }} />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: "rgba(25, 118, 210, 0.03)",
                      border: "1px solid rgba(25, 118, 210, 0.1)",
                      height: "100%"
                    }}>
                      <Typography variant="subtitle2" sx={{
                        color: "text.secondary",
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                      }}>
                        <Person fontSize="small" /> Full Name
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userData.name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: "rgba(25, 118, 210, 0.03)",
                      border: "1px solid rgba(25, 118, 210, 0.1)",
                      height: "100%"
                    }}>
                      <Typography variant="subtitle2" sx={{
                        color: "text.secondary",
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                      }}>
                        <Email fontSize="small" /> Email Address
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userData.email}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: "rgba(25, 118, 210, 0.03)",
                      border: "1px solid rgba(25, 118, 210, 0.1)",
                      height: "100%"
                    }}>
                      <Typography variant="subtitle2" sx={{
                        color: "text.secondary",
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                      }}>
                        <Phone fontSize="small" /> Mobile Number
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {details?.mobile_number || "Not provided"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Address Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}>
                  <LocationOn sx={{ color: "primary.main" }} />
                  Address Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {details ? (
                  <Paper sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "rgba(76, 175, 80, 0.03)",
                    border: "1px solid rgba(76, 175, 80, 0.2)"
                  }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <AddHomeWorkIcon sx={{ mr: 2, color: "success.main" }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Address
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {details.address_line}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Apartment sx={{ mr: 2, color: "success.main" }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              City
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {details.city}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <LocationOn sx={{ mr: 2, color: "success.main" }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              State
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {details.state}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Pin sx={{ mr: 2, color: "success.main" }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Pincode
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {details.pincode}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    <Button onClick={() => navigate('/userdetails', { state: { details } })}>Edit</Button>
                    </Grid>
                  </Paper>
                ) : (
                  <Paper sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    bgcolor: "rgba(158, 158, 158, 0.05)"
                  }}>
                    <LocationOn sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Address Details
                    </Typography>
                    <Typography color="text.secondary">
                      Please add your address information
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 3 }}
                      onClick={() => navigate("/userdetails")}
                    >
                      Add Details
                    </Button>
                  </Paper>
                )}
              </Box>

              {/* Change Password Section */}
              <Box>
                <Typography variant="h5" sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "text.primary"
                }}>
                  Security Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <ChangePassword />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Profile;