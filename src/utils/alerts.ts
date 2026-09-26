import Swal from "sweetalert2";
import type { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

const PRIMARY = "#1877F2";

// Los Dialog de MUI usan z-index 1300 y SweetAlert 1060: subimos el contenedor para que
// la alerta siempre quede por encima aunque haya un diálogo abierto.
const fire = (options: SweetAlertOptions) =>
  Swal.fire({
    ...options,
    didOpen: (popup) => {
      const container = Swal.getContainer();
      if (container) container.style.zIndex = "2000";
      options.didOpen?.(popup);
    },
  });

export const showSuccess = (title: string, text?: string) =>
  fire({ title, text, icon: "success", timer: 1800, showConfirmButton: false });

export const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Todo texto que venga del usuario o del back debe pasar por escapeHtml antes de armar el html
export const showSuccessHtml =(title: string, html: string) =>
  fire({ title, html, icon: "success", confirmButtonText: "Genial", confirmButtonColor: PRIMARY });

export const showError = (text: string, title = "Error") =>
  fire({ title, text, icon: "error", confirmButtonText: "Aceptar", confirmButtonColor: PRIMARY });

export const showWarning = (text: string, title = "Atención") =>
  fire({ title, text, icon: "warning", confirmButtonText: "Aceptar", confirmButtonColor: PRIMARY });

// html: cualquier texto variable dentro debe venir escapado con escapeHtml
export const showWarningHtml = (title: string, html: string) =>
  fire({ title, html, icon: "warning", confirmButtonText: "Entendido", confirmButtonColor: PRIMARY });

// Confirmación con detalle en html; devuelve true si se aceptó
export const confirmHtml = async (title: string, html: string, confirmButtonText: string) => {
  const result = await fire({
    title,
    html,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: PRIMARY,
    cancelButtonColor: "#6b7280",
    confirmButtonText,
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const showLoading =(title = "Procesando...") =>
  fire({ title, allowOutsideClick: false, didOpen: () => Swal.showLoading() });

export const closeAlert = () => Swal.close();

export const confirmAction = async (title: string, text: string, confirmButtonText = "Sí, confirmar") => {
  const result = await fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText,
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const showToast = (title: string, icon: SweetAlertIcon = "info") =>
  fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    timer: 4000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
