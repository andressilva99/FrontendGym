import { Box, Stack, Typography } from "@mui/material";

interface Props {
  title: string;
  subtitle: string;
  children?: React.ReactNode; // acciones (botones, filtros)
}

export default function SectionHeader({ title, subtitle, children }: Props) {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: "1px solid #eee" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        </Box>
        {children && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            useFlexGap
            alignItems={{ sm: "center" }}
            sx={{ flexWrap: { sm: "wrap", lg: "nowrap" }, justifyContent: { md: "flex-end" } }}
          >
            {children}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
