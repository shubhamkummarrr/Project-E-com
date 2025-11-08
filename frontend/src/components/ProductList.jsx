import { Link } from "react-router-dom";
import { useGetProductsQuery, useDeleteProductMutation } from "../services/userAuthApi";
import { Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductList() {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [deleteProduct, { isLoading: delLoading }] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id).unwrap();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Products</Typography>
        <Button component={Link} to="/products/new" variant="contained">+ New Product</Button>
      </Box>

      {isLoading && <Typography>Loading…</Typography>}
      {isError && <Typography color="error">Failed to load products.</Typography>}

      {!isLoading && !isError && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>In Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 && (
                <TableRow><TableCell colSpan={5}>No products yet.</TableCell></TableRow>
              )}
              {products.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>₹{p.price}</TableCell>
                  <TableCell>{p.in_stock ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <IconButton component={Link} to={`/products/${p.id}/edit`} size="small"><EditIcon fontSize="small" /></IconButton>
                    <IconButton onClick={() => handleDelete(p.id)} size="small" disabled={delLoading}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
