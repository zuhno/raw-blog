import { Link } from "@tanstack/react-router";

import AccountBtn from "../button/AccountBtn";

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

      <AccountBtn />
    </nav>
  );
};

export default Navigation;
