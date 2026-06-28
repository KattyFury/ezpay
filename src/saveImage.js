// Lưu ảnh từ canvas vào KHO ẢNH (iOS: Web Share API → "Lưu ảnh" vào Photos, không phải Files).
// Fallback (desktop/không hỗ trợ): tải file về.
export function saveImageToPhotos(canvas, filename) {
  canvas.toBlob(async (blob) => {
    if (!blob) return
    const file = new File([blob], filename, { type: 'image/png' })
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file] }); return } catch (e) { if (e?.name === 'AbortError') return }
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}
