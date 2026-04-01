export function simplifyTechLabel(value: string): string {
  const normalized = value.trim()

  if (/^spring boot/i.test(normalized)) return 'Spring Boot'
  if (/^fastapi/i.test(normalized)) return 'FastAPI'
  if (/^gin/i.test(normalized)) return 'Gin'
  if (/^elysia/i.test(normalized)) return 'Elysia'
  if (/^typescript/i.test(normalized)) return 'TypeScript'
  if (/^javascript/i.test(normalized)) return 'JavaScript'
  if (/^java/i.test(normalized)) return 'Java'
  if (/^python/i.test(normalized)) return 'Python'
  if (/^go\b/i.test(normalized)) return 'Go'
  if (/^sqlite/i.test(normalized)) return 'SQLite'

  return normalized.replace(/\s+v?\d+(\.\d+)*.*$/i, '').trim()
}
