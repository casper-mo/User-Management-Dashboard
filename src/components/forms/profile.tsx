import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge as BadgeIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { z } from "zod";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfileForm = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileSchema = z.object({
    name: z
      .string()
      .min(2, { message: t("profile.validation.nameMinLength") })
      .nonempty({ message: t("profile.validation.nameRequired") }),
    phone: z
      .string()
      .nonempty({ message: t("profile.validation.phoneRequired") })
      .regex(/^[\d\s\-\+\(\)]+$/, {
        message: t("profile.validation.phoneInvalid"),
      }),
    address: z
      .string()
      .nonempty({ message: t("profile.validation.addressRequired") }),
    jobTitle: z
      .string()
      .nonempty({ message: t("profile.validation.jobTitleRequired") }),
    yearsOfExperience: z
      .number(t("profile.validation.yearsRequired"))
      .min(0, { message: t("profile.validation.yearsMin") })
      .max(99, { message: t("profile.validation.yearsMax") }),
    workingHours: z
      .number(t("profile.validation.workingHoursRequired"))
      .min(1, { message: t("profile.validation.workingHoursMin") })
      .max(168, { message: t("profile.validation.workingHoursMax") }),
  });

  type ProfileFormData = z.infer<typeof profileSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      jobTitle: "",
      yearsOfExperience: 0,
      workingHours: 40,
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const onSubmit = async (formData: ProfileFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Randomly simulate success/error for demo purposes
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        console.log("Profile updated with:", formData);
        toast.success(t("profile.success.saved"));
      } else {
        // Simulate backend error
        throw new Error("Backend error");
      }
    } catch (err) {
      toast.error(t("profile.errors.saveFailed"));
      console.error("Profile update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "primary.main",
            mb: 3,
            textAlign: "center",
          }}
        >
          {t("profile.title")}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
            centered
          >
            <Tab label={t("profile.tabs.personal")} />
            <Tab label={t("profile.tabs.professional")} />
          </Tabs>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TabPanel value={activeTab} index={0}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("profile.fields.name")}
                  placeholder={t("profile.placeholders.name")}
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("profile.fields.phone")}
                  placeholder={t("profile.placeholders.phone")}
                  margin="normal"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("profile.fields.address")}
                  placeholder={t("profile.placeholders.address")}
                  margin="normal"
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mt: 1 }}>
                          <HomeIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Controller
              name="jobTitle"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("profile.fields.jobTitle")}
                  placeholder={t("profile.placeholders.jobTitle")}
                  margin="normal"
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="yearsOfExperience"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? 0 : Number(val));
                  }}
                  fullWidth
                  label={t("profile.fields.yearsOfExperience")}
                  placeholder={t("profile.placeholders.yearsOfExperience")}
                  margin="normal"
                  type="number"
                  error={!!errors.yearsOfExperience}
                  helperText={errors.yearsOfExperience?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="workingHours"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <TextField
                  {...field}
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? 1 : Number(val));
                  }}
                  fullWidth
                  label={t("profile.fields.workingHours")}
                  placeholder={t("profile.placeholders.workingHours")}
                  margin="normal"
                  type="number"
                  error={!!errors.workingHours}
                  helperText={errors.workingHours?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <ScheduleIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </TabPanel>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                px: 6,
                py: 1.5,
                textTransform: "uppercase",
                fontWeight: 600,
                fontSize: "1rem",
                borderRadius: 2,
                minWidth: 200,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("profile.buttons.save")
              )}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
