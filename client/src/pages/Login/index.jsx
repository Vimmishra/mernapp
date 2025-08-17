import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form.email, form.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm text-gray-600">Email</label>
            <div className="flex items-center border rounded-lg px-3">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full py-2 outline-none bg-transparent text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock className="h-4 w-4 text-gray-400 mr-2" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full py-2 outline-none bg-transparent text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
