const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(amount: number): string {
  return usd.format(amount);
}

export function formatSignedCurrency(amount: number): string {
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${sign}${usd.format(Math.abs(amount))}`;
}
