import { createFileRoute } from "@tanstack/react-router";

import { SEO } from "@/components/SEO";
import ProfileForm from "@/components/forms/profile";

export const Route = createFileRoute("/_protected/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SEO
        title="Profile"
        description="Manage your profile settings, update personal information, and configure your account preferences."
      />
      <ProfileForm />
    </>
  );
}
