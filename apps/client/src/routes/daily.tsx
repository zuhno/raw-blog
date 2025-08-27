import { createFileRoute } from "@tanstack/react-router";

import DailyTemplate from "../templates/daily";

export const Route = createFileRoute("/daily")({
  component: DailyTemplate,
});
