import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin]         = useState(true);
  const [isOTPStage, setIsOTPStage]   = useState(false);
  const [isForgotStage, setIsForgotStage] = useState(false);
  const [isForgotOTP, setIsForgotOTP] = useState(false);  // after forgot → enter otp + new pass

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [otp, setOtp]               = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [loading, setLoading]       = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const showError = (msg) => {
    setError(msg);
    setSuccess("");
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError("");
  };

  /* ── LOGIN / REGISTER ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const res = await axios.post(`${API}/user/login`, {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      } else {
        await axios.post(`${API}/user/register`, formData);
        showSuccess("Registration successful! Check your email for the OTP.");
        setIsOTPStage(true);
      }
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── VERIFY OTP (after registration) ── */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/user/verify-email`, {
        email: formData.email,
        otp,
      });
      showSuccess("Email verified! Redirecting to login…");
      setTimeout(() => {
        setIsOTPStage(false);
        setIsLogin(true);
        setOtp("");
        setSuccess("");
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── RESEND OTP ── */
  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/user/resend-otp`, { email: formData.email });
      showSuccess("OTP resent! Check your email.");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ── FORGOT PASSWORD — send OTP ── */
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/user/forgot-password`, { email: formData.email });
      showSuccess("Password reset OTP sent to your email.");
      setIsForgotOTP(true);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to send reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ── FORGOT PASSWORD — verify OTP + set new password ── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/user/reset-password`, {
        email: formData.email,
        otp,
        newPassword,
      });
      showSuccess("Password reset successful! Redirecting to login…");
      setTimeout(() => {
        setIsForgotStage(false);
        setIsForgotOTP(false);
        setIsLogin(true);
        setOtp("");
        setNewPassword("");
        setSuccess("");
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.message || "Invalid OTP or request expired.");
    } finally {
      setLoading(false);
    }
  };

  /* ── shared input className ── */
  const inputCls = "w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition";

  return (
    <div className="min-h-screen flex bg-[#f5fafa] font-[Outfit] relative overflow-hidden">

      {/* BLOBS */}
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />

      {/* LEFT */}
      <div className="w-full lg:w-[52%] flex items-center justify-center px-6 lg:px-16 z-10">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              🏍
            </div>
            <h1 className="text-2xl font-black">
              Bike<span className="text-teal-500">On</span>Rent
            </h1>
          </div>

          {/* ── ALERT BANNERS ── */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              ⚠ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl text-sm">
              ✓ {success}
            </div>
          )}

          {/* ═══════════════════════════════════
              STAGE 1 — OTP VERIFICATION
              (shown after registration)
          ═══════════════════════════════════ */}
          {isOTPStage && (
            <>
              <h2 className="text-4xl font-black mb-2">Verify Email</h2>
              <p className="text-gray-500 mb-6">
                We sent a 6-digit OTP to <strong>{formData.email}</strong>. Enter it below.
              </p>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  required
                  className={inputCls}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
                >
                  {loading ? "Verifying…" : "Verify OTP →"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-4">
                Didn't receive it?{" "}
                <span
                  onClick={handleResendOTP}
                  className="text-teal-500 cursor-pointer hover:underline"
                >
                  Resend OTP
                </span>
              </p>

              <p className="text-center text-sm text-gray-400 mt-2">
                <span
                  onClick={() => { setIsOTPStage(false); setError(""); setSuccess(""); }}
                  className="text-gray-500 cursor-pointer hover:underline"
                >
                  ← Back to register
                </span>
              </p>
            </>
          )}

          {/* ═══════════════════════════════════
              STAGE 2a — FORGOT: enter email
          ═══════════════════════════════════ */}
          {isForgotStage && !isForgotOTP && (
            <>
              <h2 className="text-4xl font-black mb-2">Reset Password</h2>
              <p className="text-gray-500 mb-6">
                Enter your registered email and we'll send you a reset OTP.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Registered Email"
                  required
                  className={inputCls}
                  onChange={handleChange}
                  value={formData.email}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Reset OTP →"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-4">
                <span
                  onClick={() => { setIsForgotStage(false); setError(""); setSuccess(""); }}
                  className="text-gray-500 cursor-pointer hover:underline"
                >
                  ← Back to login
                </span>
              </p>
            </>
          )}

          {/* ═══════════════════════════════════
              STAGE 2b — FORGOT: enter OTP + new password
          ═══════════════════════════════════ */}
          {isForgotStage && isForgotOTP && (
            <>
              <h2 className="text-4xl font-black mb-2">New Password</h2>
              <p className="text-gray-500 mb-6">
                Enter the OTP sent to <strong>{formData.email}</strong> and choose a new password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  required
                  className={inputCls}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className={inputCls}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
                >
                  {loading ? "Resetting…" : "Reset Password →"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-4">
                <span
                  onClick={() => { setIsForgotOTP(false); setError(""); setSuccess(""); }}
                  className="text-gray-500 cursor-pointer hover:underline"
                >
                  ← Back
                </span>
              </p>
            </>
          )}

          {/* ═══════════════════════════════════
              STAGE 0 — NORMAL LOGIN / REGISTER
          ═══════════════════════════════════ */}
          {!isOTPStage && !isForgotStage && (
            <>
              <h2 className="text-4xl font-black mb-2">
                {isLogin ? "Welcome back" : "Join the ride"}
              </h2>

              <p className="text-gray-500 mb-6">
                {isLogin
                  ? "Sign in to access your rides."
                  : "Create your account."}
              </p>

              {/* TABS */}
              <div className="flex border-b mb-6">
                <button
                  onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                  className={`flex-1 pb-2 ${
                    isLogin
                      ? "text-teal-500 border-b-2 border-teal-500"
                      : "text-gray-400"
                  }`}
                >
                  LOGIN
                </button>
                <button
                  onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                  className={`flex-1 pb-2 ${
                    !isLogin
                      ? "text-teal-500 border-b-2 border-teal-500"
                      : "text-gray-400"
                  }`}
                >
                  REGISTER
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="fullName"
                      placeholder="Full Name"
                      className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="phone"
                      placeholder="Phone"
                      className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className={inputCls}
                  onChange={handleChange}
                  required
                />

                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={inputCls}
                  onChange={handleChange}
                  required
                />

                {isLogin && (
                  <p
                    className="text-right text-sm text-teal-500 cursor-pointer hover:underline"
                    onClick={() => { setIsForgotStage(true); setError(""); setSuccess(""); }}
                  >
                    Forgot password?
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
                >
                  {loading
                    ? (isLogin ? "Signing in…" : "Creating account…")
                    : (isLogin ? "Sign In →" : "Create Account →")}
                </button>
              </form>
            </>
          )}

        </div>
      </div>

      {/* RIGHT HERO — unchanged */}
      <div className="hidden lg:flex w-[48%] bg-gradient-to-br from-teal-400 via-teal-600 to-teal-900 text-white flex-col justify-center px-16">
        <h1 className="text-5xl font-black leading-tight mb-6">
          Your next <br /> great ride <br /> starts here
        </h1>

        <p className="text-gray-200 mb-8 max-w-md">
          Rent bikes easily with verified owners near you.
        </p>

        <div className="space-y-3">
          <p>✔ Verified owners</p>
          <p>✔ Instant booking</p>
          <p>✔ Best prices</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;