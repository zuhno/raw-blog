import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import RootLayout from "../shared/components/layout/RootLayout";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import HomeTemplate from "../templates/home";
import DailyTemplate from "../templates/daily";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <RootLayout />
      <TanStackRouterDevtools />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeTemplate,
});

const dailyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/daily",
  component: DailyTemplate,
});

const routeTree = rootRoute.addChildren([homeRoute, dailyRoute]);

const router = createRouter({ routeTree });

export default router;
