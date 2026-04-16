import { useState } from "react";
import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Account created successfully.");
        navigate("/recipes");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Logged in successfully.");
        navigate("/recipes");
      }
    } catch (error) {
      setMessage("Authentication failed. Please check your details.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setMessage("Enter your email first to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
    } catch (error) {
      setMessage("Could not send reset email. Check the email address.");
    }
  };

  

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "350px",
          padding: "2rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {isRegister ? "Register" : "Login"}
        </h2>

        <form
          onSubmit={handleAuth}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <label>Email:</label>
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label>Password:</label>
            <br />
            <div
              style={{
                position: "relative",
                width: "100%",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  paddingRight: "2.5rem",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" style={{ width: "100%" }}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>{message}</p>

        {!isRegister && (
          <button
            type="button"
            onClick={handleForgotPassword}
            style={{ marginTop: "0.5rem", width: "100%" }}
          >
            Forgot Password?
          </button>
        )}

        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}
            style={{ width: "100%" }}
          >
            Switch to {isRegister ? "Login" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;