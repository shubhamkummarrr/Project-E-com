// components/ProtectedBuyRoute.js
import { Navigate } from "react-router-dom";
import { getToken } from "../../../services/LocalStorageService";
import { useUserGetDetailsQuery } from "../../../services/userAuthApi";
import { SignalCellularNullTwoTone } from "@mui/icons-material";


const ProtectedBuyRoute = ({ children }) => {
    const { access_token } = getToken();

    const { data: userDetails = null } = useUserGetDetailsQuery(access_token);


    // Check if user is logged in
    if (!access_token) {
        return <Navigate to="/login" />;
    }

    if (!userDetails || userDetails.length === 0) {
        return <Navigate to="/userdetails" replace />;
    }

    // User is logged in, allow access
    return children;
};

export default ProtectedBuyRoute;