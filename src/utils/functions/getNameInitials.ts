export default function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/);

  if (words.length === 0) return '';
  if (words.length === 1) {
    return words[0][0]?.toUpperCase() || '';
  }
  const firstInitial = words[0][0]?.toUpperCase() || '';
  const lastInitial = words[words.length - 1][0]?.toUpperCase() || '';

  return `${firstInitial}${lastInitial}`;
}
