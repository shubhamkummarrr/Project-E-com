import { Link } from "react-router-dom";
import { useGetProductsQuery, useDeleteProductMutation } from "../services/productApi";

export default function ProductList() {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [deleteProduct, { isLoading: delLoading }] = useDeleteProductMutation();

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      <Link to="/products/new">+ New Product</Link>
      <table border="1" cellPadding="8" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>In Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.in_stock ? "Yes" : "No"}</td>
              <td>
                <Link to={`/products/${p.id}/edit`}>Edit</Link>{" | "}
                <button
                  onClick={() => deleteProduct(p.id)}
                  disabled={delLoading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan="5">No products yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
