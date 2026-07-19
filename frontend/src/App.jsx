import { useEffect, useState } from "react";

import "./App.css";

import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import ProductTable from "./components/ProductTable";
import Footer from "./components/Footer";

import { getProducts } from "./services/productService";

function App() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <StatsCards products={products} />

        <ProductTable products={products} />

      </div>

      <Footer />
    </>
  );
}

export default App;
