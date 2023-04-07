export const formatPrice = (unit_amount: number) => {
  return (unit_amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
