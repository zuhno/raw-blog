import { createFileRoute } from "@tanstack/react-router";

import PostTemplate from "../templates/post";

export const Route = createFileRoute("/post")({
  component: PostTemplate,
});
