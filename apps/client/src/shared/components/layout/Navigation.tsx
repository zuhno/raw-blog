import { Link } from "@tanstack/react-router";

import AccountBtn from "../button/AccountBtn";

const Navigation = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 40,
      }}
    >
      <div style={{ display: "flex", gap: 20 }}>
        <Link
          to="/"
          activeProps={{ style: { fontWeight: 900 } }}
          activeOptions={{ exact: true }}
        >
          Post
        </Link>
        <Link to="/daily" activeProps={{ style: { fontWeight: 900 } }}>
          Daily
        </Link>
      </div>

      <AccountBtn />
    </nav>
  );
};

export default Navigation;
