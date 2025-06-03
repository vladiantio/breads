export async function copyToClipboard(text: string) {
  let success = true
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
    } catch {
      success = false
    }
    document.body.removeChild(textArea)
  }
  return success
}
