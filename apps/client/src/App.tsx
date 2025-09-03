import { RouterProvider } from "@tanstack/react-router";

import { router } from "./shared/configs/init";
import useTokenRefresh from "./shared/hooks/useTokenRefresh";

const App = () => {
  useTokenRefresh();

  return <RouterProvider router={router} />;
};

export default App;
