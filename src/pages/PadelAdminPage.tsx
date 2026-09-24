import { useCallback, useEffect, useState } from "react";
import { Box, Container, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SellIcon from "@mui/icons-material/Sell";

import BookingNotifications from "../components/padel/BookingNotifications";
import TimeSlotsSection from "../components/padel/admin/TimeSlotsSection";
import BookingsSection from "../components/padel/admin/BookingsSection";
import CourtsSection from "../components/padel/admin/CourtsSection";
import PricesSection from "../components/padel/admin/PricesSection";
import { getCourts } from "../api/courts.api";
import { getPrices } from "../api/prices.api";
import type { Court, Price } from "../types/padel.types";
import { getErrorMessage } from "../utils/padel.utils";
import { showError } from "../utils/alerts";

type TabKey = "turnos" | "reservas" | "canchas" | "precios";

export default function PadelAdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("turnos");
  const [courts, setCourts] = useState<Court[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);

  const loadCatalog = useCallback(async () => {
    try {
      const [courtsData, pricesData] = await Promise.all([getCourts(), getPrices()]);
      setCourts(courtsData);
      setPrices(pricesData);
    } catch (error) {
      showError(getErrorMessage(error, "No se pudieron cargar las canchas y los precios."));
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", px: { xs: 1.5, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* HEADER */}
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box component="img" src="/logo.png" sx={{ width: { xs: 44, sm: 56, md: 64 },
              height: { xs: 44, sm: 56, md: 64 },
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(24,119,242,0.2)", }} />
          <Typography sx={{ fontWeight: 800, color: "#1877F2", display: { xs: "none", sm: "block" } }}>
            Oxígeno Espacio Deportivo
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <BookingNotifications />
          <IconButton onClick={() => navigate("/")} sx={{ color: "#1877F2", bgcolor: "rgba(24, 119, 242, 0.05)" }}>
            <HomeIcon fontSize="large" />
          </IconButton>
        </Stack>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: 2000, mx: "auto", px: { xs: 0, sm: 2 } }}>
        <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {/* TÍTULO + PESTAÑAS */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              pt: { xs: 2, sm: 3 },
              borderBottom: "1px solid #eee",
              background: "linear-gradient(180deg, rgba(24,119,242,0.08) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: 26, sm: 34 } }}>
              Gestión de Padel
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Administrá turnos, reservas, canchas y precios.
            </Typography>

            <Tabs
              value={tab}
              onChange={(_, value: TabKey) => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                mt: 2,
                "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: 15, minHeight: 56 },
                "& .Mui-selected": { color: "#1877F2 !important" },
                "& .MuiTabs-indicator": { bgcolor: "#1877F2", height: 3, borderRadius: 3 },
              }}
            >
              <Tab value="turnos" label="Turnos" icon={<EventNoteIcon />} iconPosition="start" />
              <Tab value="reservas" label="Reservas" icon={<ReceiptLongIcon />} iconPosition="start" />
              <Tab value="canchas" label="Canchas" icon={<SportsTennisIcon />} iconPosition="start" />
              <Tab value="precios" label="Precios" icon={<SellIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {tab === "turnos" && <TimeSlotsSection courts={courts} prices={prices} />}
          {tab === "reservas" && <BookingsSection />}
          {tab === "canchas" && <CourtsSection courts={courts} onChanged={loadCatalog} />}
          {tab === "precios" && <PricesSection prices={prices} courts={courts} onChanged={loadCatalog} />}
        </Box>
      </Container>
    </Box>
  );
}
