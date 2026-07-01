import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/DashBoard/Dashboard";
import Products from "./pages/Product/Product";
import Category from "./pages/Category/Category";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/category" element={<Category />} />
          <Route path="/product" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;