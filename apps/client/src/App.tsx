import { RouterProvider } from "@tanstack/react-router";

import { router, initFetch } from "./shared/configs/init";

initFetch();

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
