import { Home as HomeIcon, Search as SearchIcon } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        {/* 404 Icon */}
        <Box
          sx={{
            position: "relative",
            mb: 4,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "6rem", sm: "8rem", md: "10rem" },
              fontWeight: 700,
              color: "primary.main",
              opacity: 0.2,
              lineHeight: 1,
            }}
          >
            404
          </Typography>
          <SearchIcon
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: { xs: "4rem", sm: "5rem", md: "6rem" },
              color: "primary.main",
            }}
          />
        </Box>

        {/* Error Message */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 500,
          }}
        >
          Sorry, the page you are looking for doesn't exist or has been moved.
          Please check the URL or return to the homepage.
        </Typography>

        {/* Action Button */}
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
          sx={{
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};
