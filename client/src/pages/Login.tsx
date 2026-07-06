import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Login() {
  const [, setLocation] = useLocation();
  const { get } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginMutation = trpc.auth.adminLogin.useMutation({
    onSuccess: () => {
      // Redirect to admin dashboard
      window.location.href = "/admin";
    },
    onError: (error) => {
      setError(error.message || "Login failed. Please check your credentials.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsSubmitting(false);
      return;
    }

    await loginMutation.mutateAsync({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="loginDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loginDots)" />
        </svg>
      </div>

      {/* Animated Gradient Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-black border-2 border-yellow-400 rounded-2xl p-8 md:p-12 shadow-2xl">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Sign <span className="text-yellow-400">In</span>
            </h1>
            <p className="text-gray-400">Sahu Travels Admin Portal</p>
          </div>

          {/* Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-8"></div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-yellow-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-yellow-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-yellow-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-yellow-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent my-8"></div>

          {/* Info Box */}
          <div className="bg-gray-900/50 border border-yellow-400/30 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">
              🔒 Secure login with encrypted credentials. Only admin accounts can access.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              © 2024 Sahu Travels. All rights reserved.
              <br />
              <span className="text-yellow-400">Your Fantasy - Our Mission</span>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>🔒 This is a secure admin portal. Only authorized personnel can access.</p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
