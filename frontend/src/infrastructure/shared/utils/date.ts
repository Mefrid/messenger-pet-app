// const msPerUnit = {
//   year: 31536000000,
//   month: 2628000000,
//   day: 86400000,
// } as const

export const displayRelativeTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const displayRelativeDate = (date: Date) => {
  const now = new Date()
  const anotherYear = date.getFullYear() !== now.getFullYear()

  const rtf = new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    ...(anotherYear && {
      year: 'numeric',
    }),
  })

  return rtf.format(date)
}
