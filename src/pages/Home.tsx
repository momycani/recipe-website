import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import grammaBiscuit from "../assets/Gramma-Biscuit.png";

function Home() {
  return (
    
    <main className="grammas-place-page">

      <div className="grammas-place-account-actions">
        {auth.currentUser ? (
          <Link to="/profile" className="secondary-link">
            Profile
          </Link>
        ) : (
          <Link to="/login" className="secondary-link">
            Login / Register
          </Link>
        )}
      </div>

      <section className="grammas-place-hero">
        <div className="grammas-place-content">
          <p className="grammas-place-eyebrow">Welcome to</p>

          <h1>Gramma&apos;s Place</h1>

          <p className="grammas-place-tagline">
            Simple recipes, cozy corners, and a little bit of garden magic.
          </p>

          <div className="grammas-place-bio-card">
            <h2>Meet Gramma and Biscuit</h2>

            <p>
              Gramma is the cozy heart of Gramma&apos;s Place — part home cook,
              part garden helper, and part porch-sitting storyteller. Biscuit is
              her loyal little companion, always nearby to supervise the kitchen,
              wander through the flowers, or curl up for a quiet afternoon.
            </p>

            <p>
              Around here, you&apos;ll find warm meals, fresh ideas, quiet
              corners, and the kind of simple comforts that make a house feel
              like home.
            </p>
          </div>
        </div>

        <div className="grammas-place-image-wrap">
          <img
            src={grammaBiscuit}
            alt="Gramma with Biscuit the cat"
            className="grammas-place-image"
          />
        </div>
      </section>

      <section
        className="grammas-place-section-grid"
        aria-label="Gramma's Place sections"
      >
        <article className="grammas-place-section-card">
          <h3>Gramma&apos;s Kitchen</h3>
          <p>Cozy recipes, family favorites, and simple meals made with love.</p>

          <Link to="/kitchen" className="primary-link">
            Enter the Kitchen
          </Link>
        </article>

        <article className="grammas-place-section-card coming-soon-card">
          <h3>Gramma&apos;s Garden</h3>
          <p>Fresh herbs, seasonal ideas, and garden inspiration.</p>

          <button className="secondary-link disabled-link" disabled>
            Coming Soon
          </button>
        </article>

        <article className="grammas-place-section-card coming-soon-card">
          <h3>Gramma&apos;s Corner</h3>
          <p>Stories, tips, quiet moments, and cozy little notes.</p>

          <button className="secondary-link disabled-link" disabled>
            Coming Soon
          </button>
        </article>
      </section>
    </main>
  );
}

export default Home;