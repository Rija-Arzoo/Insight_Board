import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { isValidEmail, isValidPassword } from "../utils/validation";
import Button from "../components/ui/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Invalid email format";
    if (!password) e.password = "Password is required";
    else if (!isValidPassword(password))
      e.password = "Password must be at least 8 characters";
    if (!role) e.role = "Please select a role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = login(email, password, role);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrors(result.errors || {});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-8 shadow-lg"
      >
        <h2 className="text-2xl font-extrabold tracking-tight mb-2 text-[color:var(--text)]">
          Login
        </h2>
        <p className="text-sm text-[color:var(--muted)] mb-6">
          Use the demo accounts or any email/password (8+ chars).
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-[color:var(--text)] mb-1">
            Role
          </label>
          <select
            className="border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setErrors({ ...errors, role: "" });
            }}
          >
            <option value="">Select role</option>
            <option value="manager">Manager</option>
            <option value="member">Team Member</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            className="border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] placeholder:text-[color:var(--muted)] caret-[color:var(--accent)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] placeholder:text-[color:var(--muted)] caret-[color:var(--accent)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: "" });
            }}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full py-2.5">
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
