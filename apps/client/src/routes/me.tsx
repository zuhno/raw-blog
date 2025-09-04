import { createFileRoute } from "@tanstack/react-router";

import UserTemplate from "../templates/user";

export const Route = createFileRoute("/me")({
  component: UserTemplate,
});
