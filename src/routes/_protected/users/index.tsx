import { useEffect, useState } from "react";

import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { type User, fetchUsers, getUserFullName } from "@/api/users";
import { SEO } from "@/components/SEO";
import { UserDetailsDialog } from "@/components/dialogs/UserDetailsDialog";
import { useDebounce } from "@/hooks/use-debounce";

// Search params schema
const usersSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().catch(10),
  search: z.string().optional().catch(""),
});

export const Route = createFileRoute("/_protected/users/")({
  component: RouteComponent,
  validateSearch: usersSearchSchema,
});

function RouteComponent() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const { page, pageSize, search } = searchParams;

  const [searchInput, setSearchInput] = useState(search || "");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle modal open/close
  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing selected user until after modal animation
    setTimeout(() => setSelectedUser(null), 200);
  };

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    const trimmedSearch = debouncedSearch.trim();

    if (trimmedSearch !== (search || "")) {
      navigate({
        search: {
          page: 1,
          pageSize,
          search: trimmedSearch || undefined,
        },
      });
    }
  }, [debouncedSearch, pageSize, navigate]);

  useEffect(() => {
    if (search !== searchInput) {
      setSearchInput(search || "");
    }
  }, [search]);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users", page, pageSize, search],
    queryFn: () =>
      fetchUsers({
        page,
        results: pageSize,
        searchTerm: search,
        seed: "user-management",
      }),
  });

  const handlePaginationChange = (model: GridPaginationModel) => {
    navigate({
      search: {
        page: model.page + 1,
        pageSize: model.pageSize,
        search: search || "",
      },
    });
  };

  const columns: GridColDef<User>[] = [
    {
      field: "name",
      headerName: t("users.columns.fullName"),
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => getUserFullName(row),
    },
    {
      field: "email",
      headerName: t("users.columns.email"),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "city",
      headerName: t("users.columns.city"),
      flex: 0.7,
      minWidth: 150,
      valueGetter: (_, row) => row.location.city,
    },
    {
      field: "country",
      headerName: t("users.columns.country"),
      flex: 0.7,
      minWidth: 150,
      valueGetter: (_, row) => row.location.country,
    },
    {
      field: "actions",
      headerName: t("users.columns.actions"),
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title={t("users.actions.viewDetails")}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleOpenModal(params.row)}
            aria-label={t("users.actions.viewDetails")}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <SEO
        title="Users"
        description="Browse and manage all users in your system. Search, filter, and view detailed user information."
      />
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t("users.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("users.subtitle")}
          </Typography>
        </Box>

        {/* Search Field */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={t("users.search.placeholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              maxWidth: 600,
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.paper",
              },
            }}
          />
        </Box>

        {/* Data Grid */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            height: 600,
          }}
        >
          <DataGrid
            rows={usersData?.users || []}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.email}
            pagination
            paginationMode="server"
            paginationModel={{
              page: page - 1,
              pageSize: pageSize,
            }}
            onPaginationModelChange={handlePaginationChange}
            pageSizeOptions={[5, 10, 25, 50]}
            rowCount={300} // Total rows estimate (randomuser.me doesn't provide total)
            disableRowSelectionOnClick
            slotProps={{
              loadingOverlay: {
                variant: "skeleton",
                noRowsVariant: "skeleton",
              },
            }}
            sx={{
              border: 0,
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus": {
                outline: "none",
              },
            }}
          />
        </Card>

        {/* User Details Modal */}
        <UserDetailsDialog
          open={isModalOpen}
          user={selectedUser}
          onClose={handleCloseModal}
        />
      </Box>
    </>
  );
}
