export type PackageValue = string | number | null | undefined;

function formatAmount(amount: number) {
  const rounded = Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(1);
  return rounded.replace(/\.0$/, "");
}

export function formatPackage(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    return "N/A";
  }

  if (value >= 100) {
    return `₹${formatAmount(value / 100)} Cr`;
  }

  return `₹${formatAmount(value)} LPA`;
}

export function parsePackageValue(value: PackageValue): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  const match = normalized.match(/^₹?([\d,.]+)\s*([a-zA-Z]+)?$/);

  if (!match) {
    const fallback = Number.parseFloat(normalized.replace(/,/g, ""));
    return Number.isFinite(fallback) ? fallback : null;
  }

  const amount = Number.parseFloat(match[1].replace(/,/g, ""));
  if (!Number.isFinite(amount)) {
    return null;
  }

  const unit = (match[2] || "lpa").toLowerCase();
  if (unit === "cpa" || unit === "cr" || unit === "crore") {
    return amount * 100;
  }

  return amount;
}