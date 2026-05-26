import { Link } from "react-router-dom";
import nutritionImage from "../../../../assets/GRAMMA-BISCUIT-NUTRITION.png";

function NutritionHome() {
  return (
    <main className="kitchen-subpage">
      <section className="kitchen-subpage-hero">
        <div className="kitchen-subpage-header">
          <p className="kitchen-eyebrow">Nutrition & Fitness</p>
          <h1>Support healthier kitchen habits.</h1>

          <p>
            Track nutrition, estimate recipe totals, and build out simple
            fitness tools that support everyday wellness.
          </p>

          <Link to="/kitchen" className="secondary-link">
            ← Back to Kitchen
          </Link>
        </div>

        <div className="kitchen-subpage-image-wrap">
          <img
            src={nutritionImage}
            alt="Gramma enjoying a balanced meal while Biscuit sits by the window"
            className="kitchen-subpage-image"
          />
        </div>
      </section>

      <section className="canning-card-grid">
        <Link to="/nutrition-fitness/nutrition" className="canning-card">
          <h2>Nutrition</h2>
          <p>
            Use the nutrition calculator to estimate totals and per-serving
            values for recipes.
          </p>
          <span>Open Nutrition →</span>
        </Link>

        <Link to="/nutrition-fitness/fitness" className="canning-card">
          <h2>Fitness</h2>
          <p>
            Fitness tools are coming soon, including simple activity tracking
            and wellness notes.
          </p>
          <span>Coming Soon →</span>
        </Link>
      </section>
    </main>
  );
}

export default NutritionHome;