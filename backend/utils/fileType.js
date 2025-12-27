export function getFileType(mime) {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/") || mime.startsWith("audio/")) return "viau";
  if (
    mime.includes("pdf") ||
    mime.includes("word") ||
    mime.includes("excel")
  )
    return "document";
  return "other";
}
