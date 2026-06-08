import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  // ================= USER INFO =================
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= BUSINESS INFO =================
  const [businessName, setBusinessName] = useState("");
  const [sellerTypeId, setSellerTypeId] = useState("");

  // ================= ROLE =================
  const [roleId, setRoleId] = useState("");

  // ================= LOOKUP DATA =================
  const [roles, setRoles] = useState([]);
  const [sellerTypes, setSellerTypes] = useState([]);

  // ================= UI STATE =================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH ROLES =================
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await api.get("/Role");
        setRoles(res.data);

        // auto assign Seller role
        const sellerRole = res.data.find((r) => r.name === "Seller");
        if (sellerRole) {
          setRoleId(sellerRole.id);
        }
      } catch (err) {
        console.error("Failed to load roles", err);
      }
    };

    loadRoles();
  }, []);

  // ================= FETCH SELLER TYPES =================
  useEffect(() => {
    const loadSellerTypes = async () => {
      try {
        const res = await api.get("/SellerType");
        setSellerTypes(res.data);
      } catch (err) {
        console.error("Failed to load seller types", err);
      }
    };

    loadSellerTypes();
  }, []);

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        fullName,
        email,
        password,
        roleId,
        businessName,
        sellerTypeId
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        {/* LEFT */}
        <div className="register-left">
          <div className="overlay">
            <h1>Welcome</h1>
            <p>Create your seller account and start your business journey.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="register-right">
          <form onSubmit={handleRegister}>
            <h2>Create Account</h2>
            <p className="subtitle">Fill in your details below</p>

            {error && <div className="error-box">{error}</div>}

            {/* USER SECTION */}
            {/* <h3>User Information</h3> */}

            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* BUSINESS SECTION */}
            {/* <h3>Business Information</h3> */}

            <div className="input-group">
              <label>Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Seller Type</label>
              <select
                value={sellerTypeId}
                onChange={(e) => setSellerTypeId(e.target.value)}
                required
              >
                <option value="">Select Seller Type</option>
                {sellerTypes.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            {/* hidden role */}
            <input type="hidden" value={roleId} />

            {/* SUBMIT */}
            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="bottom-text">
              Already have an account? <Link to="/">Login</Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}