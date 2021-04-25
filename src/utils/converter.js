export const formatCurrency = (currency = "USD", salary) =>
  Number(salary ?? 0).toLocaleString("en-EN", { style: "currency", currency });

export const formatBonus = (bonus) => formatCurrency("VND", bonus).substr(1).concat("");

export const normalizeJob = ({ currency = "USD", ...job }) => {
  return {
    ...job,
    currency: (() => {
      switch (currency) {
        case "VNĐ":
        case "Đ":
          return "VND";
        case "$":
          return "USD";
        case "¥":
          return "JPY";
        default:
          return currency;
      }
    })(),
  };
};
