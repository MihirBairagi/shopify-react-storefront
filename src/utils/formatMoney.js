const DEFAULT_LOCALE = "en-US";

export function formatMoney(money, locale = DEFAULT_LOCALE) {
  if (!money?.amount || !money?.currencyCode) {
    return "";
  }

  const amount = Number(money.amount);

  if (!Number.isFinite(amount)) {
    return `${money.currencyCode} ${money.amount}`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      currency: money.currencyCode,
      style: "currency",
    }).format(amount);
  } catch {
    return `${money.currencyCode} ${amount.toFixed(2)}`;
  }
}
