import { useParams, useNavigate } from "react-router-dom";
import { useGetProductQuery, useUpdateProductMutation } from "../services/productApi";
import { useEffect, useState } from "react";

export default function ProductEdit() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductQuery(id);
  const [updateProduct, { isLoading: saving }] = useUpdateProductMutation();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading || !form) return <p>Loading…</p>;
  if (isError) return <p>Failed to load product.</p>;

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateProduct({ id, ...form }).unwrap();
    navigate("/products");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Product #{id}</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Name" value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})} /><br/>
        <input placeholder="Slug" value={form.slug}
          onChange={(e)=>setForm({...form,slug:e.target.value})} /><br/>
        <textarea placeholder="Description" value={form.description}
          onChange={(e)=>setForm({...form,description:e.target.value})} /><br/>
        <input type="number" step="0.01" placeholder="Price" value={form.price}
          onChange={(e)=>setForm({...form,price:e.target.value})} /><br/>
        <label>
          <input type="checkbox" checked={form.in_stock}
            onChange={(e)=>setForm({...form,in_stock:e.target.checked})}/>
          In Stock
        </label><br/>
        <button disabled={saving} type="submit">Update</button>
      </form>
    </div>
  );
}
