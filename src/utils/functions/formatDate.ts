export function formatDate(isoTimestamp: string, locale = 'en-US'): string {
  if (!isoTimestamp) {
    return '-';
  }
  const date = new Date(isoTimestamp);

  if (Number.isNaN(date.getTime()) || date.toISOString() !== isoTimestamp) {
    return '-';
  }

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
