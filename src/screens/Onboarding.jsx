import { useState } from 'react'

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
]

const CURRENCIES = [
  { code: 'VND', label: 'VND', sub: 'Việt Nam Đồng' },
  { code: 'USDC', label: 'USDC', sub: 'USD Stablecoin' },
  { code: 'EURC', label: 'EURC', sub: 'Euro Stablecoin' },
  { code: 'CNY', label: 'CNY', sub: '人民币 / Chinese Yuan' },
]

const L = {
  vi: { title: 'Chào mừng!', langHd: 'Ngôn ngữ', curHd: 'Tiền tệ mặc định', start: 'Bắt đầu' },
  en: { title: 'Welcome!', langHd: 'Language', curHd: 'Default currency', start: 'Get started' },
  zh: { title: '欢迎！', langHd: '语言', curHd: '默认货币', start: '开始使用' },
}

export default function Onboarding() {
  const browserLang = (() => {
    const b = (navigator.language || '').toLowerCase()
    if (b.startsWith('vi')) return 'vi'
    if (b.startsWith('zh')) return 'zh'
    return 'en'
  })()

  const [lang, setLang] = useState(browserLang)
  const [currency, setCurrency] = useState('VND')
  const l = L[lang] || L.en

  function handleStart() {
    localStorage.setItem('ez_lang', lang)
    localStorage.setItem('ez_currency', currency)
    localStorage.setItem('ez_onboarded', '1')
    window.location.reload()
  }

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)' }}>
        {l.title}
      </div>

      <div style={{ gridRow: '2 / 9', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
        <div style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', fontWeight: 'var(--fw-medium)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {l.langHd}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LANGUAGES.map(lg => (
            <button key={lg.code} onClick={() => setLang(lg.code)}
              className={`btn ${lg.code === lang ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 18 }}>
              {lg.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', fontWeight: 'var(--fw-medium)', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 6 }}>
          {l.curHd}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => setCurrency(c.code)}
              className={`btn ${c.code === currency ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 18, gap: 8 }}>
              <span style={{ fontWeight: 'var(--fw-semibold)' }}>{c.label}</span>
              <span style={{ fontSize: 'var(--fs-label)', opacity: 0.75 }}>– {c.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="row-10 row10-single">
        <button className="btn btn-primary" style={{ width: '80%' }} onClick={handleStart}>
          {l.start}
        </button>
      </div>
    </div>
  )
}
