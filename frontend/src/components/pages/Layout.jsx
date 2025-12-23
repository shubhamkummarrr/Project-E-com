import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Layout = () => {
  return <>
    <CssBaseline />
    <Navbar />
    <Outlet />
    <Footer />
  </>
};

export default Layout;
