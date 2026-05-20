import { Link } from "react-router-dom";

function SafeCanning() {
  return (
    <main className="kitchen-subpage">
      <section className="kitchen-subpage-header">
        <p className="kitchen-eyebrow">Safe Canning</p>
        <h1>Preserve food safely with trusted guidance.</h1>

        <p>
          Home canning is a wonderful way to preserve family recipes, garden
          harvests, and seasonal foods, but safety matters. Always use tested,
          research-based canning instructions from trusted sources.
        </p>

        <div className="canning-button-row">
          <Link to="/canning" className="secondary-link">
            ← Back to Canning
          </Link>

          <a
            href="https://nchfp.uga.edu/"
            target="_blank"
            rel="noreferrer"
            className="secondary-link"
          >
            Visit NCHFP
          </a>
        </div>
      </section>

      <section className="safe-canning-note">
        <h2>⚠ Important Safety Note</h2>
        <p>
            Gramma’s Place shares recipes and family cooking inspiration, but canning
            safety should always come from tested, science-based sources. When in doubt,
            DO NOT preserve the recipe until you verify the correct method, processing
            time, pressure, jar size, and altitude adjustment.
        </p>
        </section>

      <section className="safe-canning-grid">
        <a
            href="https://extension.sdstate.edu/guide-water-bath-canning"
            target="_blank"
            rel="noreferrer"
            className="safe-canning-card"
            >
            <span className="safe-canning-tag">High-Acid Foods</span>
            <h2>Water-Bath Canning</h2>
            <p>
                Review water-bath canning guidance for high-acid foods such as jams,
                jellies, pickles, and many fruits when following a tested recipe.
            </p>
            <span className="safe-canning-action">Read Water-Bath Guide →</span>
        </a>

        <a
            href="https://extension.sdstate.edu/guide-pressure-canning"
            target="_blank"
            rel="noreferrer"
            className="safe-canning-card warning-card"
            >
            <span className="safe-canning-tag">Low-Acid Foods</span>
            <h2>Pressure Canning</h2>
            <p>
                Review pressure canning guidance for low-acid foods such as vegetables,
                meats, poultry, seafood, soups, and mixed recipes.
            </p>
            <span className="safe-canning-action">Read Pressure Guide →</span>
        </a>

        <a
            href="https://extension.msstate.edu/news/feature-story/2025/safe-canning-begins-correct-recipes-equipment"
            target="_blank"
            rel="noreferrer"
            className="safe-canning-card"
            >
            <span className="safe-canning-tag">Safety First</span>
            <h2>Use Tested Recipes</h2>
            <p>
                Learn why safe canning starts with correct recipes, proper equipment, and
                research-based preservation guidance.
            </p>
            <span className="safe-canning-action">Read Recipe Safety Guide →</span>
        </a>

        <a
            href="https://whatismyelevation.com/"
            target="_blank"
            rel="noreferrer"
            className="safe-canning-card"
            >
            <span className="safe-canning-tag">Location Matters</span>
            <h2>Adjust for Altitude</h2>
            <p>
                Find your elevation before canning so you can verify the correct processing
                time or pressure adjustment for your location.
            </p>
            <span className="safe-canning-action">Check Elevation →</span>
        </a>
        </section>

      
    </main>
  );
}

export default SafeCanning;