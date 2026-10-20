import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/brands")({
  beforeLoad: () => {
    throw redirect({ to: "/partners", statusCode: 301 });
  },
});
