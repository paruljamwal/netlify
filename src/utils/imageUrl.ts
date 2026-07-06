/** Use the highest-resolution image URL available from the provider. */
export function getShowImageUrl(
  image: { medium?: string; original?: string } | null | undefined,
): string | null {
  if (!image) return null
  return image.original ?? image.medium ?? null
}

export function toOriginalImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.includes('/original/')) return url
  return url.replace('/medium/', '/original/')
}
