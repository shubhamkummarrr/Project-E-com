import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../services/productApi";

export default function ProductCreate() {
  const [form, setForm] = useState({
    name: "", slug: "", description: "", price: "0.00", in_stock: true,
  });
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await createProduct({ ...form, price: Number(form.price) }).unwrap();
    navigate("/products");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Product</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Name" value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})} /><br/>
        <input placeholder="Slug (unique)" value={form.slug}
          onChange={(e)=>setForm({...form,slug:e.target.value})} /><br/>
        <textarea placeholder="Description" value={form.description}
          onChange={(e)=>setForm({...form,description:e.target.value})} /><br/>
        <input type="number" step="0.01" placeholder="Price" value={form.price}
          onChange={(e)=>setForm({...form,price:e.target.value})} /><br/>
        <label>
          <input type="checkbox" checked={form.in_stock}
            onChange={(e)=>setForm({...form,in_stock:e.target.checked})} />
          In Stock
        </label><br/>
        <button disabled={isLoading} type="submit">Save</button>
      </form>
    </div>
  );
}
