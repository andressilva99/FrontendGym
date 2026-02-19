import { api } from "./axios";
import type {
  Payment,
  GeneratePaymentDto,
} from "../types/payment.types";

export const getPayments = async (): Promise<Payment[]> => {
  const { data } = await api.get<Payment[]>("/payments");
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