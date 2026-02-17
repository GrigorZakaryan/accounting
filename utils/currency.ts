export const formatCurrency = (amount: number) => {
  return Intl.NumberFormat("us-US", {
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
