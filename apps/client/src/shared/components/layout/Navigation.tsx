import { Link } from "@tanstack/react-router";

import AccountBtn from "../button/AccountBtn";

const Navigation = () => {
  return (
    <nav style={{ marginBottom: 0 }}>
      <ul>
        <li>
          <Link
            to="/"
            activeProps={{ style: { fontWeight: 900 } }}
            activeOptions={{ exact: true }}
          >
            Post
          </Link>
        </li>
        <li>
          <Link to="/daily" activeProps={{ style: { fontWeight: 900 } }}>
            Daily
          </Link>
        </li>
      </ul>

      <AccountBtn />
    </nav>
  );
};

export default Navigation;
