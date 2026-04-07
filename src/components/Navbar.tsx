import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>
      <Link to="/recipes" style={{ marginRight: "1rem" }}>
        Recipes
      </Link>
      <Link to="/create-recipe">Create Recipe</Link>
    </nav>
  );
}

export default Navbar;