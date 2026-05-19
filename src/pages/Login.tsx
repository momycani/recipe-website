import { useState } from "react";
import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

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
      await setPersistence(auth, browserLocalPersistence);

      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        setMessage("Account created successfully.");
        navigate("/recipes");
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setMessage("Logged in successfully.");
        navigate("/recipes");
      }
    } catch (error) {
      setMessage("Authentication failed. Please check your email and password.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setMessage("Enter your email first to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage(
        "Password reset email sent. Please check your inbox, spam, or junk folder."
      );
    } catch (error) {
      setMessage("Could not send reset email. Check the email address.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="login-eyebrow">Gramma&apos;s Kitchen</p>

        <h1>{isRegister ? "Create Account" : "Welcome Back"}</h1>

        <p className="login-description">
          {isRegister
            ? "Create an account to save recipes, manage your collection, and use Gramma's Kitchen tools."
            : "Log in to access your saved recipes, profile, and kitchen tools."}
        </p>

        <form onSubmit={handleAuth} className="login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <div className="password-field-row">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="show-password-button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button type="submit" className="login-button">
            {isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        {!isRegister && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password-button"
          >
            Forgot Password?
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
          }}
          className="login-toggle-button"
        >
          {isRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>

        <Link to="/" className="login-home-link">
          Back to Gramma&apos;s Place
        </Link>
      </section>
    </main>
  );
}

export default Login;