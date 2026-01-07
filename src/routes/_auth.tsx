import { Box, Container, Typography } from "@mui/material";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { clearAuthTokens, isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  loader: () => {
    const authenticated = isAuthenticated();
    if (authenticated) throw redirect({ to: "/", replace: true });
    if (!authenticated) clearAuthTokens();
  },
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          flex: 1,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1a237e 45%, #334155 100%)",
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: "text.white",
            fontWeight: 700,
            textAlign: "center",
            px: 4,
          }}
        >
          {t("auth.welcomeBack")}
          <br />
          {t("auth.please_login_to_your_account")}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          px: 2,
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
