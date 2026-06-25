import { useState } from 'react'
import { useNav } from '../nav'

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
]

const CURRENCIES_BY_LANG = {
  vi: ['USD', 'VND', 'EUR'],
  en: ['USD', 'EUR', 'VND'],
  fr: ['USD', 'EUR', 'VND'],
  ja: ['USD', 'JPY', 'VND'],
}

const CURRENCY_LABELS = {
  USD: 'US Dollar (USD)',
  VND: 'Việt Nam Đồng (VND)',
  EUR: 'Euro (EUR)',
  JPY: 'Nhật Yên (JPY)',
}

function detectLang() {
  const lang = navigator.language?.slice(0, 2) || 'vi'
  return LANGUAGES.find(l => l.code === lang)?.code || 'vi'
}

export default function Language() {
  const { navigate } = useNav()
  const [lang, setLang] = useState(() => localStorage.getItem('ez_lang') || detectLang())
  const [currency, setCurrency] = useState(() => localStorage.getItem('ez_currency') || 'USD')

  const currencies = CURRENCIES_BY_LANG[lang] || ['USD', 'VND', 'EUR']

  function save() {
    localStorage.setItem('ez_lang', lang)
    localStorage.setItem('ez_currency', currency)
    navigate('MenuScreen')
  }

  const ROW = { display: 'flex', alignItems: 'center', gap: 12, padding: '0 4px', borderBottom: '1px solid var(--color-gray)' }
  const LABEL = { flex: 1, fontSize: 'var(--fs-item)', fontWeight: 'var(--fw-medium)' }

  return (
    <div className="screen">
      <div className="row-1 center full-bleed" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)', borderBottom: '1px solid var(--color-gray)' }}>
        Ngôn ngữ & tiền tệ
      </div>

      {/* Row 2: Language label */}
      <div className="row-2 center" style={{ justifyContent: 'flex-start' }}>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ngôn ngữ</span>
      </div>

      {/* Row 3: Language selector */}
      <div className="row-3" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {LANGUAGES.map(l => (
          <button key={l.code} onClick={() => setLang(l.code)}
            style={{
              flex: 1, height: '100%', border: `2px solid ${lang === l.code ? 'var(--color-primary)' : 'var(--color-gray)'}`,
              borderRadius: 10, background: lang === l.code ? '#DCFCE7' : 'none',
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
            }}>
            <span style={{ fontSize: 20 }}>{l.flag}</span>
            <span style={{ fontSize: 11, fontWeight: lang === l.code ? 700 : 400, color: lang === l.code ? 'var(--color-primary)' : 'var(--color-black)' }}>{l.code.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Row 4: Currency label */}
      <div className="row-4 center" style={{ justifyContent: 'flex-start' }}>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tiền tệ hiển thị</span>
      </div>

      {/* Row 5: Currency selector */}
      <div className="row-5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        {currencies.map(c => (
          <button key={c} onClick={() => setCurrency(c)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              border: `2px solid ${currency === c ? 'var(--color-primary)' : 'var(--color-gray)'}`,
              borderRadius: 10, background: currency === c ? '#DCFCE7' : 'none',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: currency === c ? 'var(--color-primary)' : 'var(--color-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {currency === c && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
            </div>
            <span style={{ fontSize: 'var(--fs-item)', fontWeight: currency === c ? 700 : 400 }}>{CURRENCY_LABELS[c]}</span>
          </button>
        ))}
      </div>

      <div className="row-10 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('MenuScreen')}>Hủy</button>
        <button className="btn btn-primary" onClick={save}>Lưu</button>
      </div>
    </div>
  )
}
