import {
  Error as ErrorIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export const ErrorBoundary = ({ error, reset }: ErrorComponentProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  const handleRetry = () => {
    reset();
  };

  // Safely extract error message
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "An unexpected error occurred";

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        {/* Error Icon */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: "50%",
            bgcolor: "error.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ErrorIcon
            sx={{
              fontSize: { xs: "4rem", sm: "5rem", md: "6rem" },
              color: "error.main",
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
            textAlign: "center",
          }}
        >
          Oops! Something Went Wrong
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          We encountered an unexpected error. Don't worry, our team has been
          notified and we're working on it.
        </Typography>

        {/* Error Details Card */}
        {process.env.NODE_ENV === "development" && (
          <Card
            sx={{
              mb: 4,
              width: "100%",
              maxWidth: 700,
              bgcolor: "grey.50",
              border: 1,
              borderColor: "error.light",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                color="error"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Error Details (Development Mode):
              </Typography>
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  color: "text.secondary",
                  mt: 1,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  overflow: "auto",
                  maxHeight: 200,
                }}
              >
                {errorMessage}
                {error instanceof Error && error.stack && (
                  <>
                    {"\n\n"}
                    {error.stack}
                  </>
                )}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={handleRetry}
            sx={{
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Try Again
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Back to Home
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
