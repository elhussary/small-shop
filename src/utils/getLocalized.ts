export function getLocalized<T extends Record<string, any>>(
  item: T,
  field: string,
  locale: string
): string {
  const value = item[`${field}_${locale}` as keyof T];
  return typeof value === "string" ? value : "";
}
