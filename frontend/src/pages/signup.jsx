// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/API";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await API.post("/auth/signup", form);
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 p-4">
//       <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30">
//         <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
//           Create Your Account
//         </h2>

//         {error && (
//           <p className="text-red-100 text-sm text-center bg-red-500/40 p-2 rounded mb-4">
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             name="name"
//             placeholder="Full Name"
//             onChange={handleChange}
//             value={form.name}
//             className="border border-white/40 bg-white/20 placeholder-white text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
//             required
//           />
//           <input
//             name="email"
//             placeholder="Email Address"
//             type="email"
//             onChange={handleChange}
//             value={form.email}
//             className="border border-white/40 bg-white/20 placeholder-white text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
//             required
//           />
//           <input
//             name="password"
//             placeholder="Password"
//             type="password"
//             onChange={handleChange}
//             value={form.password}
//             className="border border-white/40 bg-white/20 placeholder-white text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold p-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Creating Account..." : "Signup"}
//           </button>
//         </form>

//         <p className="mt-5 text-center text-white text-sm">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-pink-300 hover:underline cursor-pointer"
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/API";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await API.post("/auth/signup", form);
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-4">
//       <div className="bg-blue-900/30 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-blue-300/30">
//         <h2 className="text-3xl font-bold text-center text-blue-100 mb-6 tracking-wide">
//           Create Your Account
//         </h2>

//         {error && (
//           <p className="text-red-200 text-sm text-center bg-red-600/40 p-2 rounded mb-4">
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             name="name"
//             placeholder="Full Name"
//             onChange={handleChange}
//             value={form.name}
//             className="border border-blue-300/30 bg-blue-800/20 placeholder-blue-200 text-blue-100 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//             required
//           />
//           <input
//             name="email"
//             placeholder="Email Address"
//             type="email"
//             onChange={handleChange}
//             value={form.email}
//             className="border border-blue-300/30 bg-blue-800/20 placeholder-blue-200 text-blue-100 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//             required
//           />
//           <input
//             name="password"
//             placeholder="Password"
//             type="password"
//             onChange={handleChange}
//             value={form.password}
//             className="border border-blue-300/30 bg-blue-800/20 placeholder-blue-200 text-blue-100 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Creating Account..." : "Signup"}
//           </button>
//         </form>

//         <p className="mt-5 text-center text-blue-200 text-sm">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-blue-400 hover:underline cursor-pointer"
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

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
      {/* Decorative blurred glows */}
      <div className="pointer-events-none absolute top-[-4rem] left-[-4rem] w-96 h-96 bg-blue-600/30 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-4rem] right-[-4rem] w-96 h-96 bg-indigo-700/30 rounded-full blur-3xl" />

      {/* Card */}
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
          {/* Name */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:-translate-y-0.5 disabled:opacity-50
                       bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        {/* Login link */}
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

