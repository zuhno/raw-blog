import { RouterProvider } from "@tanstack/react-router";

import { router } from "./shared/configs/init";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
