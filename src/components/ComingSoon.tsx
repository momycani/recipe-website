import { Link } from "react-router-dom";

type ComingSoonProps = {
  eyebrow?: string;
  title: string;
  description: string;
  backTo?: string;
  backLabel?: string;
};

function ComingSoon({
  eyebrow = "Coming Soon",
  title,
  description,
  backTo = "/kitchen",
  backLabel = "← Back to Kitchen",
}: ComingSoonProps) {
  return (
    <main className="coming-soon-page">
      <section className="coming-soon-card">
        <p className="kitchen-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>

        <Link to={backTo} className="secondary-link">
          {backLabel}
        </Link>
      </section>
    </main>
  );
}

export default ComingSoon;