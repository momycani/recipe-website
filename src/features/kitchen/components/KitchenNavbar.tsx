import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

function KitchenNavbar() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="kitchen-navbar">
      <div className="kitchen-navbar-left">
        <Link to="/" className="kitchen-nav-link">
          Home
        </Link>

        <Link to="/kitchen" className="kitchen-nav-brand">
          Gramma&apos;s Kitchen
        </Link>
      </div>

      <div className="kitchen-navbar-right">
        <Link to="/profile" className="kitchen-nav-link">
          Profile
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="kitchen-logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default KitchenNavbar;