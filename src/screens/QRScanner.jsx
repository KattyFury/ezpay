import { useEffect, useRef, useState } from 'react'
import { useNav } from '../nav'

function isValid(addr) { return /^0x[0-9a-fA-F]{40}$/.test(addr.trim()) }

function parseQR(text) {
  const raw = text.trim()
  if (isValid(raw)) return { address: raw, amount: null }
  const m = raw.match(/ezwallet:(0x[0-9a-fA-F]{40})(?:\?amount=(\d+))?/)
  if (m) return { address: m[1], amount: m[2] ? parseInt(m[2]) : null }
  return null
}

export default function QRScanner() {
  const { navigate } = useNav()
  const videoRef = useRef(null)
  const loopRef = useRef(null)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('Hướng camera vào mã QR')

  useEffect(() => {
    let stream = null
    let detector = null
    let active = true

    async function start() {
      try {
        if (!window.BarcodeDetector) { setError('Trình duyệt không hỗ trợ quét QR — dán địa chỉ thủ công.'); return }
        detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (!videoRef.current) return
        videoRef.current.srcObject = stream

        async function scan() {
          if (!active || !videoRef.current) return
          try {
            const codes = await detector.detect(videoRef.current)
            if (codes.length) {
              const parsed = parseQR(codes[0].rawValue)
              if (parsed) {
                active = false
                navigate('SendAmount', { address: parsed.address, name: null, amount: parsed.amount })
                return
              } else {
                setHint('QR không hợp lệ, thử lại')
              }
            }
          } catch {}
          loopRef.current = setTimeout(scan, 300)
        }
        scan()
      } catch {
        setError('Không truy cập được camera — dán địa chỉ thủ công.')
      }
    }

    start()
    return () => {
      active = false
      clearTimeout(loopRef.current)
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [])

  return (
    <div className="screen">
      <div className="row-1 center" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)' }}>
        Quét QR
      </div>

      <div className="row-2-8" style={{ width: '100%', gap: 16 }}>
        {error ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>{error}</span>
            <button className="btn btn-secondary" style={{ width: '66.67%' }} onClick={() => navigate('PasteAddress')}>
              Dán địa chỉ
            </button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted
              style={{ width: '100%', maxHeight: 280, borderRadius: 12, background: '#000', objectFit: 'cover' }} />
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', textAlign: 'center' }}>{hint}</span>
          </>
        )}
      </div>

      <div className="row-9 row10-single">
        <button className="btn btn-secondary" onClick={() => navigate('HomeSend')}>Quay lại</button>
      </div>
    </div>
  )
}
