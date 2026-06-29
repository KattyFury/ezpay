import { useState } from 'react'
import Icon from '../components/Icon'

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
  vi: { title: 'Chào mừng!', langLabel: 'Ngôn ngữ', curLabel: 'Tiền tệ mặc định', start: 'Bắt đầu', selectLang: 'Chọn ngôn ngữ', selectCur: 'Chọn tiền tệ' },
  en: { title: 'Welcome!', langLabel: 'Language', curLabel: 'Default currency', start: 'Get started', selectLang: 'Select language', selectCur: 'Select currency' },
  zh: { title: '欢迎！', langLabel: '语言', curLabel: '默认货币', start: '开始', selectLang: '选择语言', selectCur: '选择货币' },
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
  const [picker, setPicker] = useState(null) // 'lang' | 'currency' | null
  const l = L[lang] || L.en

  const langLabel = LANGUAGES.find(x => x.code === lang)?.label || ''
  const curLabel = CURRENCIES.find(x => x.code === currency)?.label || ''

  const chipStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: '1.5px solid var(--color-gray)', borderRadius: 10,
    padding: '6px 12px', background: 'var(--color-white)',
    fontFamily: 'var(--font-base)', fontSize: 'var(--fs-body)',
    fontWeight: 'var(--fw-medium)', color: 'var(--color-content)',
    cursor: 'pointer', flexShrink: 0,
  }

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

      {/* Ngôn ngữ */}
      <div className="row-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)' }}>{l.langLabel}</span>
        <button style={chipStyle} onClick={() => setPicker('lang')}>
          {langLabel}
          <Icon name="down2" size={13} color="var(--color-muted)" />
        </button>
      </div>

      {/* Tiền tệ */}
      <div className="row-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)' }}>{l.curLabel}</span>
        <button style={chipStyle} onClick={() => setPicker('currency')}>
          {curLabel}
          <Icon name="down2" size={13} color="var(--color-muted)" />
        </button>
      </div>

      <div className="row-10 row10-single">
        <button className="btn btn-primary" style={{ width: '80%' }} onClick={handleStart}>
          {l.start}
        </button>
      </div>

      {picker && (
        <div onClick={() => setPicker(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 340, background: 'var(--color-white)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)', textAlign: 'center', marginBottom: 4 }}>
              {picker === 'lang' ? l.selectLang : l.selectCur}
            </div>
            {(picker === 'lang' ? LANGUAGES : CURRENCIES).map(o => (
              <button key={o.code}
                onClick={() => { picker === 'lang' ? setLang(o.code) : setCurrency(o.code); setPicker(null) }}
                className={`btn ${(picker === 'lang' ? o.code === lang : o.code === currency) ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 18, gap: 6 }}>
                <span style={{ fontWeight: 'var(--fw-semibold)' }}>{o.label}</span>
                {o.sub && <span style={{ fontSize: 'var(--fs-label)', opacity: 0.7 }}>– {o.sub}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
