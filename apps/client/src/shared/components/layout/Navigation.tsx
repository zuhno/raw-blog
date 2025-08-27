import { Link } from "@tanstack/react-router";

const Navigation = () => {
  return (
    <nav style={{ marginBottom: 0 }}>
      <ul>
        <li>
          <Link to="/">Post</Link>
        </li>
        <li>
          <Link to="/daily">Daily</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
