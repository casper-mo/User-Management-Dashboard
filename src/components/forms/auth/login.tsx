
import { setAuthTokens } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';



const LoginForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const loginSchema = z.object({
        email: z
            .email({ message: t('auth.validation.invalidEmail') }),
        password: z
            .string()
            .min(6, {
                message: t('auth.validation.passwordMinLength')
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
            email: '',
            password: '',
        },
    });

    const onSubmit = async (formData: LoginFormData) => {
        setIsSubmitting(true);

        try {
            // TODO: Replace with actual API call
            // Example API call would be:
            // const response = await authService.login({
            //   email: formData.email,
            //   password: formData.password,
            // });

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log('Login attempt with:', { email: formData.email });

            // Mock tokens - replace with actual tokens from API
            const mockAccessToken = 'mock_access_token_' + Date.now();
            const mockRefreshToken = 'mock_refresh_token_' + Date.now();

            // Store tokens
            setAuthTokens(mockAccessToken, mockRefreshToken);

            // Redirect to dashboard
            navigate({ to: '/', replace: true });
        } catch (err) {
            toast.error(
                t('auth.errors.signInFailed', 'Failed to sign in. Please try again.')
            );
            //
            
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 4,
                    textAlign: 'center',
                }}
            >
                {t('auth.signIn.title')}
            </Typography>

           

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label={t('auth.signIn.emailLabel')}
                            type="email"
                            placeholder='username@mail.com'
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
                                }
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
                            label={t('auth.signIn.passwordLabel')}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder='******'
                            margin="normal"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
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
                            }}
                            sx={{ mb: 1 }}
                        />
                    )}
                />

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Link
                        href="#"
                        underline="hover"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        {t('auth.signIn.forgotPassword')}
                    </Link>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                        py: 1.5,
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        fontSize: '1rem',
                        borderRadius: 2,
                    }}
                >
                    {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t('auth.signIn.signInButton')
                    )}
                </Button>
            </Box>
        </Box>
    );
};

export default LoginForm;