import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/DashBoard/Dashboard";
import Products from "./pages/Product/Product";
import ProductList from "./pages/Product/ProductList";
import Category from "./pages/Category/Category";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/category" element={<Category />} />
        <Route path="/Product/ProductList/:categoryId" element={<ProductList />}/>
          <Route path="/product" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;