export function simplifyTechLabel(value: string): string {
  const normalized = value.trim();
  return normalized.replace(/\s+v?\d+(\.\d+)*.*$/i, '').trim();
}
