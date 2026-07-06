/** Prefer TVMaze original (~680px) over medium (~210px) to avoid upscaling blur. */
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
