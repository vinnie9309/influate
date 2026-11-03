/** Saves `data` as a pretty-printed JSON file. Call from an event handler. */
export function downloadJson(data: unknown, filename: string): void {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }))
  const link = Object.assign(document.createElement("a"), { href: url, download: filename })
  link.click()
  // Some browsers start the download asynchronously; free the blob once it has had a chance to begin.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
