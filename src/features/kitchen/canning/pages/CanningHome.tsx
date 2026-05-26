import { Link } from "react-router-dom";
import CanningCard from "../components/CanningCard";
import canningImage from "../../../../assets/GRAMMA-BISCUIT-CANNING.png";

function CanningHome() {
  return (
    <main className="kitchen-subpage">
      <section className="kitchen-subpage-hero">
        <div className="kitchen-subpage-header">
          <p className="kitchen-eyebrow">Gramma’s Pantry</p>
          <h1>Canning & Preserving</h1>

          <p>
            Keep canning recipes, processing notes, jar details, categories, and
            safety reminders organized in one cozy place. Always verify canning
            methods with trusted, research-based preservation resources.
          </p>

          <div className="canning-button-row">
            <Link to="/kitchen" className="secondary-link">
              ← Back to Kitchen
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
        </div>

        <div className="kitchen-subpage-image-wrap">
          <img
            src={canningImage}
            alt="Gramma canning vegetables in a cozy kitchen with Biscuit nearby"
            className="kitchen-subpage-image"
          />
        </div>
      </section>

      <section className="canning-card-grid">
        <CanningCard
          title="Safe Canning"
          description="Learn the basics of safe water-bath and pressure canning before preserving food."
          link="/canning/safe-canning"
        />

        <CanningCard
          title="Create Canning Recipe"
          description="Add a canning recipe with ingredients, jar size, processing method, and notes."
          link="/canning/create"
        />
      </section>
    </main>
  );
}

export default CanningHome;