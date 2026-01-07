import { Close as CloseIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { type User, getUserFullName } from "@/api/users";

interface UserDetailsDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export const UserDetailsDialog = ({
  open,
  user,
  onClose,
}: UserDetailsDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="user-details-dialog-title"
    >
      <DialogTitle
        id="user-details-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {t("users.modal.title")}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        {user && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Avatar
                src={user.picture.large}
                alt={getUserFullName(user)}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid",
                  borderColor: "primary.main",
                  boxShadow: 2,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  {t("users.modal.fields.fullName")}
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {getUserFullName(user)}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  {t("users.modal.fields.email")}
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                  {user.email}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  {t("users.modal.fields.phone")}
                </Typography>
                <Typography variant="body1">{user.phone}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    mb: 0.5,
                    display: "block",
                  }}
                >
                  {t("users.modal.fields.address")}
                </Typography>
                <Typography variant="body1">
                  {user.location.street.number} {user.location.street.name}
                </Typography>
                <Typography variant="body1">
                  {user.location.city}, {user.location.state}
                </Typography>
                <Typography variant="body1">{user.location.country}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
