import { Link, Outlet } from "@tanstack/react-router";

const RootLayout = () => {
  return (
    <div>
      <header
        style={{
          boxShadow: "0 3px 3px #00000010",
          paddingBottom: 0,
        }}
      >
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
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
