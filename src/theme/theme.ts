import type { ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

// Custom color palette
const lightPalette = {
  primary: {
    main: "#1a237e",
    light: "#534bae",
    dark: "#000051",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#00897b",
    light: "#4ebaaa",
    dark: "#005b4f",
    contrastText: "#ffffff",
  },
  background: {
    default: "#f5f7fa",
    paper: "#ffffff",
  },
  text: {
    primary: "#1a1a2e",
    secondary: "#64748b",
    white: "#ffffff",

  },
};

const darkPalette = {
  primary: {
    main: "#7c4dff",
    light: "#b47cff",
    dark: "#3f1dcb",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#64ffda",
    light: "#9effff",
    dark: "#14cba8",
    contrastText: "#000000",
  },
  background: {
    default: "#0f0f23",
    paper: "#1a1a2e",
  },
  text: {
    primary: "#e2e8f0",
    secondary: "#94a3b8",
    white: "#fff",
  },
};

// Shared theme options
const getThemeOptions = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light" ? lightPalette : darkPalette),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
        contained: {
          background:
            mode === "light"
              ? "linear-gradient(135deg, #1a237e 0%, #534bae 100%)"
              : "linear-gradient(135deg, #7c4dff 0%, #b47cff 100%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            mode === "light"
              ? "0 4px 20px rgba(0, 0, 0, 0.08)"
              : "0 4px 20px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(10px)",
          background:
            mode === "light"
              ? "rgba(255, 255, 255, 0.9)"
              : "rgba(26, 26, 46, 0.9)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow:
            mode === "light"
              ? "0 2px 12px rgba(0, 0, 0, 0.06)"
              : "0 2px 12px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === "light" ? "#1a237e" : "#7c4dff",
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 600,
            backgroundColor: mode === "light" ? "#f1f5f9" : "#252543",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor:
              mode === "light"
                ? "rgba(26, 35, 126, 0.04)"
                : "rgba(124, 77, 255, 0.08)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

export const createAppTheme = (mode: "light" | "dark") => {
  return createTheme(getThemeOptions(mode));
};

export const lightTheme = createAppTheme("light");
export const darkTheme = createAppTheme("dark");
