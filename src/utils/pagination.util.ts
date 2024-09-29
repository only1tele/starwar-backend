export function extractPageNumber(url: string | null): number | null {
  if (!url) return null;

  const pageMatch = url.match(/page=(\d+)/);
  return pageMatch ? Number(pageMatch[1]) : null;
}

export function extractIdFromUrl(url: string): string | null {
  const regex = /\/(\d+)\/?$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
