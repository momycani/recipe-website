import { Link } from "react-router-dom";
import kitchenImage from "../../../assets/GRAMMA-BISCUIT- KITCHEN.png";

function KitchenHome() {
  return (
    <main className="kitchen-home-page">
      <section className="kitchen-hero">
        <div className="kitchen-hero-content">
          <p className="kitchen-eyebrow">Welcome to Gramma&apos;s Kitchen</p>

          <h1>Save, organize, and share your favorite recipes.</h1>

          <p className="kitchen-description">
            Create your own recipe collection, calculate nutrition, browse
            shared recipes in the Recipe Bank, and save copies you can edit as
            your own.
          </p>

          <div className="kitchen-actions">
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
        </div>

        <div className="kitchen-hero-image-wrap">
          <img
            src={kitchenImage}
            alt="Gramma and Biscuit in the kitchen"
            className="kitchen-hero-image"
          />
        </div>
      </section>

      <section className="kitchen-feature-grid">
        <div className="kitchen-feature-card">
          <h3>My Recipes</h3>
          <p>
            Keep your personal recipes private, organized, and easy to edit.
          </p>
        </div>

        <div className="kitchen-feature-card">
          <h3>Recipe Bank</h3>
          <p>
            Browse public recipes shared by the community and save your own
            editable copy.
          </p>
        </div>

        <div className="kitchen-feature-card">
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

export default KitchenHome;