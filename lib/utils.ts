export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function absoluteUploadPath(url: string) {
  return url.startsWith('/') ? url : `/${url}`;
}