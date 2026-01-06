import { Layout } from "@/components/layout";
import { isAuthenticated } from "@/lib/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  loader: () => {
    const authenticated = isAuthenticated();
    if (!authenticated)
      throw redirect({ to: "/login", replace: true });
  },
});

function RouteComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
