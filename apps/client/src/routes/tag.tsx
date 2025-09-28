import { createFileRoute } from "@tanstack/react-router";

import TagTemplate from "../templates/tag";

export const Route = createFileRoute("/tag")({
  component: TagTemplate,
});
