import { createFileRoute } from "@tanstack/react-router";

import EditTemplate from "../templates/edit";

export const Route = createFileRoute("/edit/$id")({
  component: EditTemplate,
});
