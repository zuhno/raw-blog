import { createRouter } from "@tanstack/react-router";

import { routeTree } from "../../routeTree.gen";
import { visitorsApi } from "../apis";

/** @description Router config */
export const router = createRouter({ routeTree });

export const initFetch = () => {
  if (navigator.cookieEnabled) {
    visitorsApi.postLog();
  }
};

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
