export const createURLWithQueryParams = (
  apiPath: string,
  params: Record<string, string | number>,
): string => {
  const url = new URL(apiPath, 'https://dummy.com')
  const stringParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  )

  url.search = new URLSearchParams(stringParams).toString()

  const finalPath = url.pathname + url.search

  return finalPath
}
