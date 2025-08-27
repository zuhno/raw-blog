import { createFileRoute } from "@tanstack/react-router";

import HomeTemplate from "../templates/home";

export const Route = createFileRoute("/")({
  component: HomeTemplate,
});
