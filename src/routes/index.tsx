import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { t } = useTranslation();
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" gutterBottom color="primary">
        {t("welcome")} to the User Management Dashboard! Select a user from the
        menu to
      </Typography>
    </Container>
  );
}
