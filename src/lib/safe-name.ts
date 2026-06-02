export function safeFileName(name: string): string {
  return name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "") // invalid filename chars
    .replace(/\s+/g, "_") // spaces -> _
    .slice(0, 100); // max length
}
