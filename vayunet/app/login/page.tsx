"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post(
          "http://localhost:5000/api/login",
          { email, password },
          { withCredentials: true }
        );

        setMessage("✅ " + res.data.message);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/home");
      } else {
        // SIGNUP
        const res = await axios.post(
          "http://localhost:5000/api/signup",
          {
            full_name: fullName,
            email,
            password,
            phone,
          },
          { withCredentials: true }
        );

        setMessage("✅ " + res.data.message);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/home");

        // Switch to login after signup (optional)
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(
        "❌ " + (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-3">
          {isLogin ? "Login" : "Create Account"}
        </h3>

        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Signup Only Fields */}
          {!isLogin && (
            <>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Common Fields */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn w-100 ${isLogin ? "btn-primary" : "btn-success"}`}
            disabled={loading}
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-3">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsLogin(false);
                  setMessage("");
                }}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-success"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsLogin(true);
                  setMessage("");
                }}
              >
                Login
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
