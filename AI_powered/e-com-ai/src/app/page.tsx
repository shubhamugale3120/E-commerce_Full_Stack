"use client";

import { useEffect, useState } from "react";
import  Product  from "@/models/Product";

// type Product = {
//   _id?: string;
//   id?: string;
//   image?: string;
//   title?: string;
//   description?: string;
//   category?: string;
//   price?: number;
// };

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        console.log(data); // Check API response

        // If your API returns { products: [...] }
        setProducts(data.products || data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    const res = await fetch("/api/ai-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setProducts(data.products);
  }

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <input value={query} type="text" onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="border p-2 rounded w-full mb-4" />
      <button onClick={handleSearch} className="bg-red-500 text-white px-4 py-2 rounded mb-6">Search</button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id || product.id}
              className="border rounded-lg shadow-md p-4"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="text-xl font-semibold mt-3">
                {product.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {product.description}
              </p>

              <p className="text-sm text-blue-600 mt-2">
                {product.category}
              </p>

              <p className="text-lg font-bold mt-3">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </main>
  );
}