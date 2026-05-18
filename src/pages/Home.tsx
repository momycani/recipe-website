import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="home-eyebrow">Welcome to Gramma’s Kitchen</p>

        <h1>Save, organize, and share your favorite recipes.</h1>

        <p className="home-description">
          Create your own recipe collection, calculate nutrition, browse shared
          recipes in the Recipe Bank, and save copies you can edit as your own.
        </p>

        <div className="home-actions">
          <Link to="/create-recipe" className="primary-link">
            Create Recipe
          </Link>

          <Link to="/recipes" className="secondary-link">
            My Recipes
          </Link>

          <Link to="/recipe-bank" className="secondary-link">
            Recipe Bank
          </Link>
        </div>
      </section>

      <section className="home-feature-grid">
        <div className="home-feature-card">
          <h3>My Recipes</h3>
          <p>
            Keep your personal recipes private, organized, and easy to edit.
          </p>
        </div>

        <div className="home-feature-card">
          <h3>Recipe Bank</h3>
          <p>
            Browse public recipes shared by the community and save your own
            editable copy.
          </p>
        </div>

        <div className="home-feature-card">
          <h3>Nutrition Preview</h3>
          <p>
            View total and per-serving nutrition details while building each
            recipe.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;