import { Outlet } from "@tanstack/react-router";

import Navigation from "./Navigation";

const RootLayout = () => {
  return (
    <div>
      <header
        style={{
          boxShadow: "0 3px 3px #00000010",
          paddingBottom: 0,
        }}
      >
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
