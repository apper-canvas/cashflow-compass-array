import { format } from "date-fns";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export const formatDateShort = (date) => {
  return format(new Date(date), "MMM dd");
};

export const formatPercent = (value) => {
  return `${Math.round(value)}%`;
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};