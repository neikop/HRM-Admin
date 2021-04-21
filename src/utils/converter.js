export const formatCurrency = (currency = "USD", salary) =>
  Number(salary).toLocaleString("en-EN", { style: "currency", currency });

export const formatBonus = (bonus) => formatCurrency("VND", bonus).substr(1);

export const normalizeJob = ({ currency = "USD", ...job }) => ({
  ...job,
  currency: currency === "¥" ? "JPY" : currency === "VNĐ" ? "VND" : currency,
});
