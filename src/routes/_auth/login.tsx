import { createFileRoute } from "@tanstack/react-router";

import { SEO } from "@/components/SEO";
import LoginForm from "@/components/forms/auth/login";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SEO
        title="Login"
        description="Sign in to your User Management System account to manage users, roles, and permissions."
      />
      <LoginForm />
    </>
  );
}
