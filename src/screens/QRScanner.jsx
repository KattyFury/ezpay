import { useEffect, useRef, useState } from 'react'
import { useNav } from '../nav'

function isValid(addr) { return /^0x[0-9a-fA-F]{40}$/.test(addr.trim()) }

function parseQR(text) {
  // Support: raw 0x address, or ezwallet:0x...?amount=...
  const raw = text.trim()
  if (isValid(raw)) return { address: raw, amount: null }
  const m = raw.match(/ezwallet:(0x[0-9a-fA-F]{40})(?:\?amount=(\d+))?/)
  if (m) return { address: m[1], amount: m[2] ? parseInt(m[2]) : null }
  return null
}

export default function QRScanner() {
  const { navigate } = useNav()
  const videoRef = useRef(null)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    let stream = null
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) videoRef.current.srcObject = stream
        setScanning(true)
      } catch {
        setError('Không truy cập được camera — dán địa chỉ thủ công.')
      }
    }
    start()
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()) }
  }, [])

  async function handleCapture() {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    try {
      const { BarcodeDetector } = window
      if (!BarcodeDetector) { setError('Trình duyệt không hỗ trợ quét QR — dán địa chỉ thủ công.'); return }
      const detector = new BarcodeDetector({ formats: ['qr_code'] })
      const codes = await detector.detect(canvas)
      if (!codes.length) { setError('Không tìm thấy QR — thử lại.'); return }
      const parsed = parseQR(codes[0].rawValue)
      if (!parsed) { setError('QR không hợp lệ.'); return }
      navigate('SendAmount', { address: parsed.address, name: null, amount: parsed.amount })
    } catch { setError('Lỗi khi quét — thử lại.') }
  }

  return (
    <div className="screen">
      <div className="row-1 center" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)' }}>
        Quét QR
      </div>

      <div className="row-2-8" style={{ width: '100%', gap: 12 }}>
        {error ? (
          <div style={{ textAlign: 'center', gap: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>{error}</span>
            <button className="btn btn-secondary" style={{ width: '66.67%' }} onClick={() => navigate('PasteAddress')}>
              Dán địa chỉ
            </button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted
              style={{ width: '100%', maxHeight: 300, borderRadius: 12, background: '#000', objectFit: 'cover' }} />
            {scanning && (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCapture}>
                Chụp & quét
              </button>
            )}
          </>
        )}
      </div>

      <div className="row-9 row10-single">
        <button className="btn btn-secondary" onClick={() => navigate('HomeSend')}>Quay lại</button>
      </div>
    </div>
  )
}
