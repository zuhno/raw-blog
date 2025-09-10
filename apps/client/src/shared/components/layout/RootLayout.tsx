import { Outlet } from "@tanstack/react-router";

import Navigation from "./Navigation";

const RootLayout = () => {
  return (
    <>
      <header style={{ padding: 10 }}>
        <Navigation />
      </header>
      <main style={{ padding: 10 }}>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
