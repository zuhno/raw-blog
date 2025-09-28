import { Link } from "@tanstack/react-router";

import AccountBtn from "../button/AccountBtn";

const activeProps = { style: { fontWeight: 900 } };

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
        <Link to="/" activeProps={activeProps} activeOptions={{ exact: true }}>
          Home
        </Link>
        <Link to="/post" activeProps={activeProps}>
          Post
        </Link>
        <Link to="/daily" activeProps={activeProps}>
          Daily
        </Link>
        <Link to="/tag" activeProps={activeProps}>
          Tag
        </Link>
      </div>

      <AccountBtn />
    </nav>
  );
};

export default Navigation;
