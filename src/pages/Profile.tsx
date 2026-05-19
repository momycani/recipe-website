import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Profile() {
  const [message, setMessage] = useState("");
  const user = auth.currentUser;

  const handlePasswordReset = async () => {
    setMessage("");

    if (!user?.email) {
      setMessage("No email address was found for this account.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage("Password reset email sent. Please check your inbox, spam, or junk folder.");
    } catch (error) {
      setMessage("Unable to send password reset email. Please try again.");
    }
  };

  if (!user) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <p className="profile-eyebrow">Account</p>
          <h1>Profile</h1>
          <p>You are not currently logged in.</p>

          <div className="profile-page-actions">
            <Link to="/login" className="primary-link">
              Go to Login
            </Link>

            <Link to="/" className="secondary-link">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <p className="profile-eyebrow">Account</p>
        <h1>Your Profile</h1>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span>Email / Login ID</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-info-item">
            <span>User ID</span>
            <strong>{user.uid}</strong>
          </div>

          <div className="profile-info-item">
            <span>Email Verified</span>
            <strong>{user.emailVerified ? "Yes" : "No"}</strong>
          </div>

          <div className="profile-info-item">
            <span>Account Created</span>
            <strong>{user.metadata.creationTime || "Not available"}</strong>
          </div>

          <div className="profile-info-item">
            <span>Last Sign-In</span>
            <strong>{user.metadata.lastSignInTime || "Not available"}</strong>
          </div>

          <div className="profile-info-item">
            <span>Password</span>
            <strong>Hidden for security</strong>
          </div>
        </div>

        <div className="profile-password-card">
          <h2>Password Help</h2>
          <p>
            For security, your current password cannot be displayed. You can send
            a password reset email to your login email address.
          </p>

          <button
            type="button"
            onClick={handlePasswordReset}
            className="primary-link profile-reset-button"
          >
            Send Password Reset Email
          </button>

          {message && <p className="profile-message">{message}</p>}
        </div>

        <div className="profile-page-actions">
          <Link to="/kitchen" className="secondary-link">
            Back to Kitchen
          </Link>

          <Link to="/" className="secondary-link">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Profile;