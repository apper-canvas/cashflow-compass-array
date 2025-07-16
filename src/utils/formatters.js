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
  if (!date || date === '') return 'Invalid date';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  return format(dateObj, "MMM dd, yyyy");
};

export const formatDateShort = (date) => {
  if (!date || date === '') return 'Invalid';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid';
  return format(dateObj, "MMM dd");
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