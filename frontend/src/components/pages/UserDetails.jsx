import React, { useState } from 'react';
import { useUserDetailsMutation } from '../../services/userAuthApi';
import { useNavigate } from 'react-router-dom';


const states = [
    'Maharashtra', 'Karnataka', 'Delhi', 'Kerala', 'Punjab', 'Gujarat', 'TamilNadu', 'Rajasthan', 'WestBengal'
];

const UserDetails = () => {
    const [form, setForm] = useState({
        user_full_name: '',
        mobile_number: '',
        address_line: '',
        city: '',
        STATE_CHOICES: states[0],
        pincode: ''
    });

    const navigate = useNavigate();

    const [userDetails] = useUserDetailsMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        userDetails(form);
        alert('User details saved');
        navigate("/buyproducts");
    };

    return (
        <div style={{ maxWidth: 720, margin: '24px auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
            <h2>User Details</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
                <label style={{ display: 'block' }}>
                    Full Name
                    <input name="user_full_name" value={form.user_full_name} onChange={handleChange} placeholder="Full name" style={{ width: '100%', padding: 8, marginTop: 6 }} />
                </label>

                <label style={{ display: 'block' }}>
                    Mobile Number
                    <input name="mobile_number" value={form.mobile_number} onChange={handleChange} placeholder="10-digit mobile" style={{ width: '100%', padding: 8, marginTop: 6 }} />
                </label>

                <label style={{ display: 'block' }}>
                    Address Line
                    <input name="address_line" value={form.address_line} onChange={handleChange} placeholder="House, street, area" style={{ width: '100%', padding: 8, marginTop: 6 }} />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <label>
                        City
                        <input name="city" value={form.city} onChange={handleChange} placeholder="City" style={{ width: '100%', padding: 8, marginTop: 6 }} />
                    </label>

                    <label>
                        State
                        <select name="STATE_CHOICES" value={form.STATE_CHOICES} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 6 }}>
                            {states.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </label>
                </div>

                <label style={{ display: 'block' }}>
                    Pincode
                    <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" style={{ width: '100%', padding: 8, marginTop: 6 }} />
                </label>

                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <button type="submit" style={{ padding: '10px 14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6 }}>Save</button>
                    <button type="button" onClick={() => setForm({ user_full_name: '', mobile_number: '', address_line: '', city: '', STATE_CHOICES: states[0], pincode: '' })} style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: 6 }}>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default UserDetails;
