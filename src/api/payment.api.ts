import { api } from "./axios";
import type {
  Payment,
  GeneratePaymentDto,
} from "../types/payment.types";

// from / to: rango de meses de cuota "YYYY-MM", ambos incluidos. isPaid: solo pagados / impagos.
// Sin filtros trae todos.
export const getPayments = async (
  filters: { from?: string; to?: string; isPaid?: boolean } = {}
): Promise<Payment[]> => {
  const { data } = await api.get<Payment[]>("/payments", { params: filters });
  return data;
};

export const generatePayments = async (
  payload: GeneratePaymentDto
) => {
  const { data } = await api.post(
    "/payments/generate",
    payload
  );
  return data;
};

export const togglePayment = async (id: string) => {
  const { data } = await api.patch(`/payments/${id}/toggle`);
  return data;
};

export const updatePaymentShare = async (
  id: string,
  shareId: string
) => {
  const { data } = await api.patch(`/payments/${id}`, {
    shareId,
  });
  return data;
};

export const deletePayment = async (id: string) => {
  const { data } = await api.delete(`/payments/${id}`);
  return data;
};