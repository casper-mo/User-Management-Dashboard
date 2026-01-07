import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { z } from "zod";

import { VALID_EMAIL, VALID_PASSWORD } from "@/lib";
import { type User, setAuthTokens, setUser } from "@/lib/auth";

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginSchema = z.object({
    email: z.email({ message: t("auth.validation.invalidEmail") }),
    password: z.string().min(6, {
      message: t("auth.validation.passwordMinLength"),
    }),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: LoginFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate credentials
      if (
        formData.email !== VALID_EMAIL ||
        formData.password !== VALID_PASSWORD
      ) {
        toast.error(
          t(
            "auth.errors.invalidCredentials",
            "Invalid email or password. Please try again."
          )
        );
        setIsSubmitting(false);
        return;
      }

      // Mock successful authentication
      const mockAccessToken = "mock_access_token_" + Date.now();
      const mockRefreshToken = "mock_refresh_token_" + Date.now();

      // Store tokens in cookies
      setAuthTokens(mockAccessToken, mockRefreshToken);

      // Create user object
      const user: User = {
        name: "Quantum User",
        email: formData.email,
        phone: "123-456-7890",
        jobTitle: "Software Engineer",
        address: "123 Quantum St, Entanglement City",
      };

      // Store user in localStorage
      setUser(user);

      navigate({ to: "/", replace: true });
    } catch (err) {
      toast.error(
        t(
          "auth.errors.signInFailed",
          "An error occurred during login. Please try again."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "primary.main",
          mb: 4,
          textAlign: "center",
        }}
      >
        {t("auth.signIn.title")}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t("auth.signIn.emailLabel")}
              type="email"
              placeholder="username@mail.com"
              autoComplete="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t("auth.signIn.passwordLabel")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="******"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 1 }}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            textTransform: "uppercase",
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: 2,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("auth.signIn.signInButton")
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
