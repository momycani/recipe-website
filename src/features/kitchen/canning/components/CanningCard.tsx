import { Link } from "react-router-dom";

type CanningCardProps = {
  title: string;
  description: string;
  link: string;
};

function CanningCard({ title, description, link }: CanningCardProps) {
  return (
    <Link to={link} className="canning-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <span>Open →</span>
    </Link>
  );
}

export default CanningCard;