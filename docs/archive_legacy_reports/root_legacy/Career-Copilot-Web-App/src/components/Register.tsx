import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Alert } from "./ui/alert";

export function Register() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // Mock registration - in real app, this would call an API
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1A1714] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="bg-[#25232A] rounded-[28px] p-8"
          style={{
            backgroundImage: "radial-gradient(circle, #E6DEFF 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundBlendMode: "overlay",
            backgroundPosition: "0 0",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D0BCFF] to-[#A8C5A3] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🦄</span>
            </div>
            <h1
              style={{
                fontSize: "3rem",
                lineHeight: "1.1",
                fontFamily: "Roboto Flex, sans-serif",
                fontWeight: "800",
                fontStretch: "150%",
                color: "#E6E1E5",
              }}
            >
              Career{" "}
              <span
                style={{
                  fontFamily: "Roboto Serif, serif",
                  fontStyle: "italic",
                  fontWeight: "300",
                  color: "#D0BCFF",
                }}
              >
                Copilot
              </span>
            </h1>
            <p className="text-[#CAC4D0] mt-2">Create your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-[#E07A5F]/20 border-[#E07A5F] text-[#E07A5F]">{error}</Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm text-[#CAC4D0] mb-2"
                style={{
                  fontFamily: "Roboto Flex, sans-serif",
                  fontStretch: "50%",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Display Name
              </label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm text-[#CAC4D0] mb-2"
                style={{
                  fontFamily: "Roboto Flex, sans-serif",
                  fontStretch: "50%",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm text-[#CAC4D0] mb-2"
                style={{
                  fontFamily: "Roboto Flex, sans-serif",
                  fontStretch: "50%",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm text-[#CAC4D0] mb-2"
                style={{
                  fontFamily: "Roboto Flex, sans-serif",
                  fontStretch: "50%",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#2B2930] border-[#49454F] text-[#E6E1E5] rounded-full h-12"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D0BCFF] text-[#381E72] hover:bg-[#E6DDFF] rounded-full h-12"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-[#CAC4D0] text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#D0BCFF] hover:text-[#E6DDFF]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
