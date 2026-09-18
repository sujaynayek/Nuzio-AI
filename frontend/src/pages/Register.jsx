import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Radio,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setIsLoading(true);

    const res = await register({ name, email, password });
    setIsLoading(false);

    if (res.success) {
      onRegisterSuccess();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-sm mx-auto w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-glow-purple mb-3">
            <Radio className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-3xl text-white font-medium">
            Create Account
          </h2>
          <p className="text-xs text-nuzio-muted mt-1">
            Start receiving personalized AI news briefings
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-nuzio-muted">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-nuzio-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-nuzio-subtle border border-nuzio-border focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-nuzio-dim outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-nuzio-muted">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-nuzio-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-nuzio-subtle border border-nuzio-border focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-nuzio-dim outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-nuzio-muted">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-nuzio-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-nuzio-subtle border border-nuzio-border focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-nuzio-dim outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl gradient-btn-purple text-xs font-bold text-white shadow-glow-purple flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Create Free Account</span>
          </button>
        </form>

        {/* Login link */}
        <div className="text-center mt-6">
          <button
            onClick={onSwitchToLogin}
            className="text-xs text-nuzio-muted hover:text-white"
          >
            Already have an account?{" "}
            <span className="text-purple-400 font-semibold underline underline-offset-4">
              Sign in
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
