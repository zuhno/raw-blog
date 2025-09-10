import { createFileRoute } from "@tanstack/react-router";

import DetailTemplate from "../templates/detail";

export const Route = createFileRoute("/detail/$id")({
  component: DetailTemplate,
});
