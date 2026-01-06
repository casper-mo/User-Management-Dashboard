import { createFileRoute } from "@tanstack/react-router";

import ProfileForm from "@/components/forms/profile";

export const Route = createFileRoute("/_protected/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProfileForm />;
}
