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
  const fileRef = useRef(null)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('Hướng camera vào mã QR')

  useEffect(() => {
    let stream = null
    let detector = null
    let active = true

    async function start() {
      try {
        if (!window.BarcodeDetector) { setError('Trình duyệt không hỗ trợ quét QR — chọn ảnh QR hoặc dán địa chỉ.'); return }
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
        setError('Không truy cập được camera — chọn ảnh QR hoặc dán địa chỉ.')
      }
    }

    start()
    return () => {
      active = false
      clearTimeout(loopRef.current)
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [])

  async function handlePickImage(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      if (!window.BarcodeDetector) { setHint('Trình duyệt không hỗ trợ đọc QR từ ảnh'); return }
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
      const bitmap = await createImageBitmap(file)
      const codes = await detector.detect(bitmap)
      const parsed = codes.length ? parseQR(codes[0].rawValue) : null
      if (parsed) {
        navigate('SendAmount', { address: parsed.address, name: null, amount: parsed.amount })
      } else {
        setHint('Không tìm thấy mã QR hợp lệ trong ảnh')
      }
    } catch {
      setHint('Không đọc được ảnh QR')
    }
  }

  return (
    <div className="screen">
      <div className="row-1-5 center col" style={{ gap: 18 }}>
        {error ? (
          <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)', textAlign: 'center', padding: '0 20px' }}>{error}</span>
        ) : (
          <>
            {/* Ô vuông quét QR — trung tâm hàng 1-5 */}
            <div style={{ position: 'relative', width: '62%', aspectRatio: '1', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
              <video ref={videoRef} autoPlay playsInline muted
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* khung góc */}
              {[
                { top: 8, left: 8, borderTop: '3px solid #fff', borderLeft: '3px solid #fff' },
                { top: 8, right: 8, borderTop: '3px solid #fff', borderRight: '3px solid #fff' },
                { bottom: 8, left: 8, borderBottom: '3px solid #fff', borderLeft: '3px solid #fff' },
                { bottom: 8, right: 8, borderBottom: '3px solid #fff', borderRight: '3px solid #fff' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 28, height: 28, borderRadius: 4, ...s }} />
              ))}
            </div>
            <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', textAlign: 'center' }}>{hint}</span>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={handlePickImage} style={{ display: 'none' }} />

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>Ảnh QR</button>
        <button className="btn btn-primary" onClick={() => navigate('HomeSend')}>Quay lại</button>
      </div>
    </div>
  )
}
