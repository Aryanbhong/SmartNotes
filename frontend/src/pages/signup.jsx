import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import API from "../services/API";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden p-4 text-slate-100">
    
      <div className="pointer-events-none absolute top-[-4rem] left-[-4rem] w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-4rem] right-[-4rem] w-96 h-96 bg-indigo-700/30 rounded-full blur-3xl" />

  
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-800/80 backdrop-blur-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-300 mb-6 tracking-wide">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-300 text-sm text-center bg-red-900/50 border border-red-500/30 p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
        
          <div className="relative">
            <User
              className="absolute left-3 top-3.5 text-blue-400 pointer-events-none"
              size={18}
            />
            <input
              autoFocus
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-lg border border-slate-600 bg-slate-700 placeholder-slate-400 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div className="relative">
            <Mail
              className="absolute left-3 top-3.5 text-blue-400 pointer-events-none"
              size={18}
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-lg border border-slate-600 bg-slate-700 placeholder-slate-400 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

      
          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 text-blue-400 pointer-events-none"
              size={18}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-lg border border-slate-600 bg-slate-700 placeholder-slate-400 text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

   
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:-translate-y-0.5 disabled:opacity-50
                       bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <p className="mt-5 text-center text-slate-300 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;

