import {
  Close as CloseIcon,
  Home,
  Menu as MenuIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "@tanstack/react-router";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: <Home />,
  },
  {
    path: "/users",
    label: "Users",
    icon: <PeopleIcon />,
  },
  // Add more menu items here
];

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const SideMenu = ({ open, onClose, onOpen }: SideMenuProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = 280;

  const menuContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{
              height: 80,
              filter: theme.palette.mode === "dark" ? "none" : "invert(1)",
              borderRadius: 8,
            }}
          />
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: "auto", py: 2 }}>
        <List>
          {menuItems.map((item) => {
            return (
              <ListItem key={item.path} disablePadding sx={{ px: 2, mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={isMobile ? onClose : undefined}
                  sx={{
                    borderRadius: 1,
                    bgcolor: "transparent",
                    color: "text.primary",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    '&[data-status="active"]': {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "inherit",
                      },
                      "& .MuiListItemText-primary": {
                        fontWeight: 600,
                      },
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "text.secondary",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          © 2026 User Management
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile: Hamburger Menu Button */}
      {isMobile && !open && (
        <IconButton
          onClick={onOpen}
          sx={{
            position: "fixed",
            top: 10,
            start: 25,
            zIndex: 1200,
            bgcolor: "background.paper",
            // boxShadow: 2,
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Desktop: Permanent Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          {menuContent}
        </Drawer>
      )}

      {/* Mobile: Temporary Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {menuContent}
        </Drawer>
      )}
    </>
  );
};

export default SideMenu;
