import React, { useMemo, useState } from "react";
import ProductCard from "../ProductCard";
import { useGetProductsQuery, useUserGetDetailsQuery } from "../../services/userAuthApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../features/cartSlice";
import { getToken } from "../../services/LocalStorageService";
import { useNavigate } from "react-router-dom";


const BuyProducts = () => {

    const INDIA_STATE_TAX = {
        Maharashtra: 0.18,
        Karnataka: 0.18,
        Delhi: 0.12,
        Kerala: 0.05,
        Punjab: 0.12,
        Gujarat: 0.18,
        TamilNadu: 0.12,
        Rajasthan: 0.12,
        WestBengal: 0.05,
        Default: 0.18,
    };

    const navigate = useNavigate();

    const { data: products = [], isLoading } = useGetProductsQuery();
    const dispatch = useDispatch();
    const cartItems = useSelector((s) => s.cart.items || []);

    const [selectedState, setSelectedState] = useState("Maharashtra");
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [showQR, setShowQR] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, it) => sum + (Number(it.discounted_price || 0) * (it.qty || 1)), 0);
    }, [cartItems]);

    const taxRate = INDIA_STATE_TAX[selectedState] ?? INDIA_STATE_TAX.Default;
    const taxAmount = +(subtotal * taxRate).toFixed(2);
    const total = +(subtotal + taxAmount).toFixed(2);

    const { access_token } = getToken();

    const { data: userDetails = null } = useUserGetDetailsQuery(access_token);
    console.log(userDetails)


    const handleBuy = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        // 🔐 LOGIN CHECK
        if (!access_token) {
            // You can open a login modal instead of navigate
            // but no buy until they login
            alert(`Please login first.`);
            navigate("/login");
            return;
        }

        if (!userDetails || userDetails.length === 0) {
            alert("Please fill in your user details before buying.");
            navigate("/userdetails");
            return;
        }

        // ✅ Allowed to buy
        if (paymentMethod === "cod") {
            setOrderPlaced(true);
            dispatch(clearCart());
        } else if (paymentMethod === "upi") {
            setShowQR(true);
        } else {
            setOrderPlaced(true);
            dispatch(clearCart());
        }
    };

    const completeUPIPayment = () => {
        setShowQR(false);
        setOrderPlaced(true);
        dispatch(clearCart());
    };

    return (
        <div style={{ display: "flex", gap: 24, padding: 20, textAlign: "center", justifyContent: "center" }}>
            <aside style={{ width: 680, borderLeft: "1px solid #eee", paddingLeft: 20 }}>
                <h3>Your Cart</h3>
                {cartItems.length === 0 && <div>Your cart is empty.</div>}

                {cartItems.map((it) => (
                    <div key={it.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                        <div style={{ width: 64, height: 64, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee" }}>
                            {it.img_link ? <img src={it.img_link} alt={it.product_name} style={{ maxWidth: "100%", maxHeight: "100%" }} /> : <div style={{ color: "#aaa" }}>No img</div>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "70vh", // adjust as per your UI
                                }}
                                title={it.product_name} // hover par full name dikhega
                            >
                                {it.product_name}
                            </div>

                            <div style={{ color: "#6b7280" }}>₹{it.discounted_price} x {it.qty}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <button onClick={() => dispatch(addToCart(it))} style={{ padding: "6px 8px" }}>+</button>
                            <button onClick={() => dispatch(removeFromCart(it.id))} style={{ padding: "6px 8px" }}>-</button>
                        </div>
                    </div>
                ))}

                <div style={{ marginTop: 12 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>Select state (India) for tax:</label>
                    <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} style={{ width: "100%", padding: 8 }}>
                        {Object.keys(INDIA_STATE_TAX).filter(s => s !== 'Default').map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                        {/* {userDetails.state && !Object.keys(INDIA_STATE_TAX).includes(userDetails.state) && (
                            <option key={userDetails.state} value={userDetails.state}>{userDetails.state}</option>
                        )} */}
                    </select>
                </div>

                <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><div>Subtotal</div><div>₹{subtotal.toFixed(2)}</div></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><div>Tax ({(taxRate * 100).toFixed(0)}%)</div><div>₹{taxAmount.toFixed(2)}</div></div>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}><div>Total</div><div>₹{total.toFixed(2)}</div></div>
                </div>

                <div style={{ marginTop: 14 }}>
                    <label style={{ display: "block", marginBottom: 6 }}>Payment method</label>
                    <div style={{ display: "flex", gap: 8 }}>
                        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input type="radio" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} /> UPI / QR
                        </label>
                        <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Cash on Delivery
                        </label>
                    </div>
                </div>

                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                    <button onClick={handleBuy} style={{ flex: 1, padding: "10px 12px", background: "#059669", color: "white", border: "none", borderRadius: 6 }}>Buy Now</button>
                    <button onClick={() => dispatch(clearCart())} style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 6 }}>Clear</button>
                </div>

                {showQR && (
                    <div style={{ marginTop: 16, padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>Scan to pay (UPI)</div>
                        <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "white", margin: "0 auto" }}>
                            {/* placeholder QR - in a real app replace with merchant QR image/data */}
                            <div style={{ textAlign: "center" }}>
                                <img style={{ width: 180, height: 180 }} src="/public/MyQR.jpeg" alt="QR Code"></img>
                            </div>
                        </div>
                        <div style={{ marginTop: 10, textAlign: "center" }}>
                            <button onClick={completeUPIPayment} style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: 6 }}>I paid — Complete</button>
                            <button onClick={() => setShowQR(false)} style={{ marginLeft: 8, padding: "8px 12px" }}>Cancel</button>
                        </div>
                    </div>
                )}

                {orderPlaced && (
                    <div style={{ marginTop: 16, padding: 12, background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 6 }}>
                        <div style={{ fontWeight: 700 }}>Order placed successfully!</div>
                        <div>Payment: {paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</div>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default BuyProducts;




