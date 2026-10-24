// Formatted input uses dots as thousands separators; API numbers retain decimals.
export const parseReceiptAmount = (value: unknown): number => {
  const amount = typeof value === "string"
    ? Number(value.replace(/\./g, "").replace(/,/g, "."))
    : Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

export const receiptTotal = (amount: unknown, vat: unknown): number =>
  Math.round(parseReceiptAmount(amount) * (1 + (Number(vat) || 0) / 100));
