import { Home as HomeIcon, NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

interface BreadcrumbSegment {
  label: string;
  path: string;
  isLast: boolean;
}

const Breadcrumb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const matches = useMatches();

  const getBreadcrumbSegments = (): BreadcrumbSegment[] => {
    const segments: BreadcrumbSegment[] = [];

    const relevantMatches = matches.filter(
      (match) =>
        match.pathname !== "/" &&
        match.pathname !== "" &&
        !match.pathname.startsWith("/login")
    );

    const isDashboard = relevantMatches.length === 0;

    if (isDashboard) {
      segments.push({
        label: t("breadcrumb.dashboard"),
        path: "/",
        isLast: true,
      });
      return segments;
    }

    relevantMatches.forEach((match, index) => {
      const pathParts = match.pathname.split("/").filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1] || "";

      // Map route segments to translated labels
      let label = lastPart;
      const translationKey = `breadcrumb.${lastPart}`;

      const translated = t(translationKey);
      if (translated !== translationKey) {
        label = translated;
      } else {
        label = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
      }

      segments.push({
        label,
        path: match.pathname,
        isLast: index === relevantMatches.length - 1,
      });
    });

    return segments;
  };

  const breadcrumbSegments = getBreadcrumbSegments();

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  // Check if we're on the dashboard/home page
  const isDashboardOnly =
    breadcrumbSegments.length === 1 && breadcrumbSegments[0].path === "/";

  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
      sx={{
        "& .MuiBreadcrumbs-separator": {
          mx: 0.5,
        },
      }}
    >
      {!isDashboardOnly && (
        <Link
          component="button"
          onClick={() => handleNavigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              color: "primary.main",
              textDecoration: "underline",
            },
            border: "none",
            background: "none",
            padding: 0,
            font: "inherit",
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: "1.25rem" }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t("breadcrumb.home") !== "breadcrumb.home"
              ? t("breadcrumb.home")
              : "Home"}
          </Typography>
        </Link>
      )}

      {/* Show dashboard label with home icon if on dashboard */}
      {isDashboardOnly && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <HomeIcon
            sx={{ mr: 0.5, fontSize: "1.25rem", color: "text.primary" }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            {breadcrumbSegments[0].label}
          </Typography>
        </Box>
      )}

      {/* Show other breadcrumb segments */}
      {!isDashboardOnly &&
        breadcrumbSegments.map((segment) =>
          segment.isLast ? (
            <Typography
              key={segment.path}
              variant="body2"
              sx={{
                color: "text.primary",
                fontWeight: 600,
              }}
            >
              {segment.label}
            </Typography>
          ) : (
            <Link
              key={segment.path}
              component="button"
              onClick={() => handleNavigate(segment.path)}
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
                border: "none",
                background: "none",
                padding: 0,
                font: "inherit",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {segment.label}
              </Typography>
            </Link>
          )
        )}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
