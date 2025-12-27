import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginReg from "./components/pages/auth/LoginReg";
import ResetPassword from "./components/pages/auth/ResetPassword";
import SendPasswordResetEmail from "./components/pages/auth/SendPasswordResetEmail";
import Contact from "./components/pages/Contact";
import Profile from "./components/pages/Profile";
import Home from "./components/pages/Home";
import Layout from "./components/pages/Layout";
import { useSelector } from "react-redux";
import ProductList from "./components/ProductList";
import ProductCreate from "./components/ProductCreate";
import ProductEdit from "./components/ProductEdit";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ new import
import ProductPage from "./components/ProductPage";

function App() {
  const { access_token } = useSelector((state) => state.auth);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />

            {/* These can stay open or protected later */}
            <Route path="products/new" element={<ProductCreate />} />
            <Route path="productpage/:id" element={<ProductPage />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />

            <Route path="contact" element={<Contact />} />
            <Route
              path="login"
              element={
                access_token ? <Navigate to="/Profile" /> : <LoginReg />
              }
            />
            <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />
            <Route path="reset" element={<ResetPassword />} />
          </Route>

          <Route
            path="/Profile"
            element={
              access_token ? <Profile /> : <Navigate to="/login" />
            }
          />

          <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
