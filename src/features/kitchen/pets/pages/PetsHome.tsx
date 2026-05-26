import { Link } from "react-router-dom";
import biscuitPlaygroundImage from "../../../../assets/BISCUITS PLAYGROUND.png";

function PetsHome() {
  return (
    <main className="kitchen-subpage">
      <section className="kitchen-subpage-hero">
        <div className="kitchen-subpage-header">
          <p className="kitchen-eyebrow">Biscuit’s Playground</p>
          <h1>A playful corner for pets, tips, and cozy ideas.</h1>

          <p>
            Biscuit’s Playground is a cheerful space for pet-friendly notes,
            simple reminders, treat safety, and fun ideas for the furry family
            members.
          </p>

          <Link to="/kitchen" className="secondary-link">
            ← Back to Kitchen
          </Link>
        </div>

        <div className="kitchen-subpage-image-wrap">
          <img
            src={biscuitPlaygroundImage}
            alt="Biscuit the tabby cat playing outside with a puppy and pet toys"
            className="kitchen-subpage-image"
          />
        </div>
      </section>

      <section className="canning-card-grid">
        <article className="canning-card">
          <h2>Pet Notes</h2>
          <p>
            Save reminders, routines, favorite toys, and helpful care notes for
            pets.
          </p>
          <span>Coming Soon →</span>
        </article>

        <article className="canning-card">
          <h2>Treats & Food Safety</h2>
          <p>
            Keep track of pet-safe treat ideas and foods that should be avoided.
          </p>
          <span>Coming Soon →</span>
        </article>

        <article className="canning-card">
          <h2>Play Ideas</h2>
          <p>
            Collect enrichment ideas, indoor play activities, and outdoor fun
            for curious pets.
          </p>
          <span>Coming Soon →</span>
        </article>
      </section>
    </main>
  );
}

export default PetsHome;