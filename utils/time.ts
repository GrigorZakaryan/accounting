export function toUTCDateOnly(date: Date | undefined) {
  if (date === undefined) {
    return undefined;
  }
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}
