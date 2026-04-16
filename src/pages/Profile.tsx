import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Profile</h2>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>No user is currently logged in.</p>
      )}
    </div>
  );
}

export default Profile;