import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, FormControlLabel, Checkbox, Typography, Paper } from "@mui/material";
import { useCreateProductMutation } from "../services/userAuthApi";

export default function ProductCreate() {
  const [form, setForm] = useState({ name: "", slug: "", description: "", price: "0.00", in_stock: true });
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ ...form, price: Number(form.price) }).unwrap();
      navigate("/products");
    } catch (err) {
      console.error('Create failed', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Create Product</Typography>
        <Box component="form" onSubmit={onSubmit} noValidate>
          <TextField fullWidth name="name" label="Name" value={form.name} onChange={onChange} sx={{ mb: 2 }} required />
          <TextField fullWidth name="slug" label="Slug (unique)" value={form.slug} onChange={onChange} sx={{ mb: 2 }} required />
          <TextField fullWidth name="description" label="Description" value={form.description} onChange={onChange} sx={{ mb: 2 }} multiline rows={4} />
          <TextField fullWidth name="price" label="Price" value={form.price} onChange={onChange} sx={{ mb: 2 }} type="number" inputProps={{ step: '0.01' }} />
          <FormControlLabel control={<Checkbox checked={form.in_stock} name="in_stock" onChange={onChange} />} label="In Stock" />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" disabled={isLoading} sx={{ mr: 1 }}>Save</Button>
            <Button variant="outlined" onClick={() => navigate('/products')}>Cancel</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
