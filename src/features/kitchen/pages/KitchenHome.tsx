import { Link } from "react-router-dom";
import kitchenImage from "../../../assets/GRAMMA-BISCUIT-KITCHEN.png";

function KitchenHome() {
  return (
    <main className="kitchen-home-page">
      <section className="kitchen-hero">
        <div className="kitchen-hero-content">
          <p className="kitchen-eyebrow">Welcome to Gramma&apos;s Kitchen</p>

          <h1>Save, organize, and share your favorite kitchen ideas.</h1>

          <p className="kitchen-description">
            Create recipes, manage your personal collection, browse shared
            favorites, plan nutrition goals, save canning notes, and keep cozy
            pet ideas all in one place.
          </p>
        </div>

        <div className="kitchen-hero-image-wrap">
          <img
            src={kitchenImage}
            alt="Gramma and Biscuit in the kitchen"
            className="kitchen-hero-image"
          />
        </div>
      </section>

      <section className="kitchen-feature-grid" aria-label="Kitchen features">
        <Link to="/create-recipe" className="kitchen-feature-card">
          <span className="kitchen-card-label">Start here</span>
          <h3>Create Recipe</h3>
          <p>
            Add a recipe manually, calculate nutrition, and save it to your
            personal collection.
          </p>
          <span className="kitchen-card-link">Create a recipe →</span>
        </Link>

        <Link to="/recipes" className="kitchen-feature-card">
          <span className="kitchen-card-label">Your collection</span>
          <h3>My Recipes</h3>
          <p>
            Keep your personal recipes private, organized, and easy to edit.
          </p>
          <span className="kitchen-card-link">View my recipes →</span>
        </Link>

        <Link to="/recipe-bank" className="kitchen-feature-card">
          <span className="kitchen-card-label">Shared recipes</span>
          <h3>Recipe Bank</h3>
          <p>
            Browse public recipes shared by the community and save your own
            editable copy.
          </p>
          <span className="kitchen-card-link">Browse recipe bank →</span>
        </Link>

        <Link to="/nutrition" className="kitchen-feature-card">
          <span className="kitchen-card-label">Wellness</span>
          <h3>Nutrition &amp; Fitness</h3>
          <p>
            Estimate calorie and macro needs, save wellness targets, and adjust
            goals as your activity changes.
          </p>
          <span className="kitchen-card-link">Open nutrition tools →</span>
        </Link>

        <Link to="/canning" className="kitchen-feature-card">
          <span className="kitchen-card-label">Preserving</span>
          <h3>Safe Canning</h3>
          <p>
            Save canning recipes, processing notes, jar details, and trusted
            safety resources in one place.
          </p>
          <span className="kitchen-card-link">Open safe canning →</span>
        </Link>

        <Link to="/pets" className="kitchen-feature-card">
          <span className="kitchen-card-label">Pets</span>
          <h3>Biscuit&apos;s Playground</h3>
          <p>
            Save pet treats, food ideas, training notes, toys, tips, and tricks
            for your favorite furry friends.
          </p>
          <span className="kitchen-card-link">
            Visit Biscuit&apos;s Playground →
          </span>
        </Link>
      </section>
    </main>
  );
}

export default KitchenHome;