import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Share } from "../types/share.types";
import { getShares, deleteShare } from "../api/shares.api";
import SharesTable from "../components/shares/SharesTable";
import ShareForm from "../components/shares/SharesForm";

export default function SharesPage() {
  const [shares, setShares] = useState<Share[]>([]);
  const [editingShare, setEditingShare] = useState<Share | null>(null);
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const loadShares = async () => {
    const data = await getShares();
    setShares(data);
  };

  useEffect(() => {
    loadShares();
  }, []);

  const handleCreate = () => {
    setEditingShare(null);
    setOpen(true);
  };

  const handleEdit = (share: Share) => {
    setEditingShare(share);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar cuota?")) return;
    await deleteShare(id);
    loadShares();
  };

  const handleClose = () => {
    setOpen(false);
    setEditingShare(null);
  };

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4">
          Gestión de Cuotas
        </Typography>

        <Button variant="contained" onClick={handleCreate}>
          Nueva Cuota
        </Button>
      </Box>

      <SharesTable
        shares={shares}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingShare ? "Editar Cuota" : "Crear Cuota"}
        </DialogTitle>
        <DialogContent>
          <ShareForm
            share={editingShare}
            onFinish={() => {
              handleClose();
              loadShares();
            }}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}