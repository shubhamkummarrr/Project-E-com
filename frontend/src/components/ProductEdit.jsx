import { useParams, useNavigate } from "react-router-dom";
import { useGetProductQuery, useUpdateProductMutation } from "../services/userAuthApi";
import { useEffect, useState } from "react";
import { Box, Paper, Typography, TextField, FormControlLabel, Checkbox, Button } from "@mui/material";

export default function ProductEdit() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductQuery(id);
  const [updateProduct, { isLoading: saving }] = useUpdateProductMutation();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { if (data) setForm({ name: data.name || '', slug: data.slug || '', description: data.description || '', price: data.price || 0, in_stock: data.in_stock || false }); }, [data]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  if (isLoading || !form) return <p>Loading…</p>;
  if (isError) return <p>Failed to load product.</p>;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ id, ...form }).unwrap();
      navigate("/products");
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Edit Product #{id}</Typography>
        <Box component="form" onSubmit={onSubmit} noValidate>
          <TextField fullWidth name="name" label="Name" value={form.name} onChange={onChange} sx={{ mb: 2 }} required />
          <TextField fullWidth name="slug" label="Slug" value={form.slug} onChange={onChange} sx={{ mb: 2 }} required />
          <TextField fullWidth name="description" label="Description" value={form.description} onChange={onChange} sx={{ mb: 2 }} multiline rows={4} />
          <TextField fullWidth name="price" label="Price" value={form.price} onChange={onChange} sx={{ mb: 2 }} type="number" inputProps={{ step: '0.01' }} />
          <FormControlLabel control={<Checkbox checked={form.in_stock} name="in_stock" onChange={onChange} />} label="In Stock" />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" disabled={saving} sx={{ mr: 1 }}>Update</Button>
            <Button variant="outlined" onClick={() => navigate('/products')}>Cancel</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
