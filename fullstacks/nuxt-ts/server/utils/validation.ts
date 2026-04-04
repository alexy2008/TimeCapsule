type CreateCapsuleValidationResult =
  | { error: string }
  | { value: { title: string; content: string; creator: string; openAt: string } }

export function validateCreateCapsuleInput(input: Record<string, unknown>): CreateCapsuleValidationResult {
  const title = typeof input.title === 'string' ? input.title.trim() : ''
  const content = typeof input.content === 'string' ? input.content.trim() : ''
  const creator = typeof input.creator === 'string' ? input.creator.trim() : ''
  const openAt = typeof input.openAt === 'string' ? input.openAt.trim() : ''

  if (!title) return { error: '标题不能为空' }
  if (title.length > 100) return { error: '标题长度不能超过 100 个字符' }
  if (!content) return { error: '内容不能为空' }
  if (!creator) return { error: '发布者不能为空' }
  if (creator.length > 30) return { error: '发布者长度不能超过 30 个字符' }
  if (!openAt) return { error: '开启时间不能为空' }

  const openDate = new Date(openAt)
  if (Number.isNaN(openDate.getTime())) return { error: '开启时间格式无效' }
  if (openDate.getTime() <= Date.now()) return { error: '开启时间必须晚于当前时间' }

  return {
    value: {
      title,
      content,
      creator,
      openAt: openDate.toISOString(),
    },
  }
}

export function validateCode(code: string) {
  return /^[A-Z0-9]{8}$/.test(code)
}
