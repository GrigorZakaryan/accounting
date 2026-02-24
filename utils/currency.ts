export const formatCurrency = (amount: number) => {
  return Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const convertDecimalToInt = (n: number) => {
  return n * 100;
};

export const convertIntToDecimal = (n: number) => {
  return n / 100;
};
