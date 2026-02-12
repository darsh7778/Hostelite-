import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔹 Password Strength Checker
  const getPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.match(/[@$!%*?&]/)
    ) {
      return "Strong";
    }
    return "Medium";
  };

  const validatePassword = () => {
    let tempErrors = {};

    if (newPassword.length < 6) {
      tempErrors.newPassword = "Password must be at least 6 characters";
    }

    if (newPassword !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 🔹 Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      alert("OTP sent successfully");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setLoading(true);
      await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      alert("Password updated successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <button style={styles.button} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
            />

            {/* Password Field */}
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
              />
              <span
                style={styles.eye}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>

            {newPassword && (
              <p
                style={{
                  color:
                    strength === "Weak"
                      ? "red"
                      : strength === "Medium"
                      ? "orange"
                      : "green",
                  fontSize: "14px",
                }}
              >
                Strength: {strength}
              </p>
            )}

            {errors.newPassword && (
              <p style={styles.error}>{errors.newPassword}</p>
            )}

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />

            {errors.confirmPassword && (
              <p style={styles.error}>{errors.confirmPassword}</p>
            )}

            <button style={styles.button} disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        <p style={styles.back} onClick={() => navigate("/login")}>
          Back to Login
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f6f8",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    width: "350px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "13px",
  },
  back: {
    marginTop: "15px",
    cursor: "pointer",
    color: "#007bff",
    textAlign: "center",
  },
  passwordWrapper: {
    position: "relative",
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "18px",
    cursor: "pointer",
  },
};
