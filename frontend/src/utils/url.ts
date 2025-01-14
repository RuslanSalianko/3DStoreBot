export function buildUrlWithParams(
  url: string,
  params?: Record<string, string>,
) {
  if (!params || Object.keys(params).length === 0) return url;

  const queryString = new URLSearchParams(params);
  return `${url}?${queryString.toString()}`;
}
