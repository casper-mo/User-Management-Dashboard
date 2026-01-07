import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { NotFound } from "@/components/errors/NotFound";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: "bottom-right",
          defaultOpen: false,
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel isOpen={false} />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  ),
  errorComponent: ErrorBoundary,
  notFoundComponent: NotFound,
});
