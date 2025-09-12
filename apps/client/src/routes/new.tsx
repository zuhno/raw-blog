import { createFileRoute } from "@tanstack/react-router";

import NewTemplate from "../templates/new";

export const Route = createFileRoute("/new")({
  component: NewTemplate,
});
