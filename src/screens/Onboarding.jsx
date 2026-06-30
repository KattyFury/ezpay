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

// Tiền tệ mặc định theo ngôn ngữ (anh có thể đổi tay sau)
const CUR_BY_LANG = { vi: 'VND', zh: 'CNY', en: 'USDC' }

const L = {
  vi: { title: 'Chào mừng!', sub: 'Xin hãy chọn ngôn ngữ và tiền tệ hiển thị', langLabel: 'Ngôn ngữ', curLabel: 'Tiền tệ mặc định', start: 'Bắt đầu', selectLang: 'Chọn ngôn ngữ', selectCur: 'Chọn tiền tệ' },
  en: { title: 'Welcome!', sub: 'Please choose your language and display currency', langLabel: 'Language', curLabel: 'Default currency', start: 'Get started', selectLang: 'Select language', selectCur: 'Select currency' },
  zh: { title: '欢迎！', sub: '请选择语言和显示货币', langLabel: '语言', curLabel: '默认货币', start: '开始', selectLang: '选择语言', selectCur: '选择货币' },
}

export default function Onboarding() {
  const browserLang = (() => {
    const b = (navigator.language || '').toLowerCase()
    if (b.startsWith('vi')) return 'vi'
    if (b.startsWith('zh')) return 'zh'
    return 'en'
  })()

  const [lang, setLang] = useState(browserLang)
  const [currency, setCurrency] = useState(CUR_BY_LANG[browserLang] || 'USDC')
  const [curTouched, setCurTouched] = useState(false) // anh đã tự chọn tiền tệ chưa
  const [picker, setPicker] = useState(null)           // 'lang' | 'currency' | null
  const l = L[lang] || L.en

  const langLabel = LANGUAGES.find(x => x.code === lang)?.label || ''
  const curLabel = CURRENCIES.find(x => x.code === currency)?.label || ''

  // Đổi ngôn ngữ → tiền tệ tự theo (trừ khi anh đã tự chọn tiền tệ riêng)
  function pickLang(code) {
    setLang(code)
    if (!curTouched) setCurrency(CUR_BY_LANG[code] || 'USDC')
    setPicker(null)
  }
  function pickCur(code) { setCurrency(code); setCurTouched(true); setPicker(null) }

  function handleStart() {
    localStorage.setItem('ez_lang', lang)
    localStorage.setItem('ez_currency', currency)
    localStorage.setItem('ez_onboarded', '1')
    window.location.reload()
  }

  // Hàng chọn — đồng bộ style .menu-item như màn Ngôn ngữ & tiền tệ
  const Row = ({ label, value, onClick }) => (
    <button className="menu-item" style={{ width: '100%', padding: '16px 4px' }} onClick={onClick}>
      <span style={{ flex: 1, fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
      <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-content)', border: '1.5px solid var(--color-gray)', borderRadius: 8, padding: '4px 12px', marginRight: 8 }}>{value}</span>
      <Icon name="right2" size={15} color="var(--color-faint)" />
    </button>
  )

  return (
    <div className="screen">
      {/* Tiêu đề + phụ đề, nhóm trên (đồng vị trí cụm logo) */}
      <div className="row-2-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 10px' }}>
        <div className="screen-title" style={{ fontSize: 'var(--fs-amount)', fontWeight: 'var(--fw-medium)' }}>{l.title}</div>
        <div style={{ fontSize: 'var(--fs-body)', color: 'var(--color-muted)', textAlign: 'center', lineHeight: 1.3 }}>{l.sub}</div>
      </div>

      {/* 2 hàng chọn — 1 cụm, mỗi thứ 1 hàng (hàng 5 + 6) */}
      <div className="row-5" style={{ display: 'flex', alignItems: 'center' }}>
        <Row label={l.langLabel} value={langLabel} onClick={() => setPicker('lang')} />
      </div>
      <div className="row-6" style={{ display: 'flex', alignItems: 'center' }}>
        <Row label={l.curLabel} value={curLabel} onClick={() => setPicker('currency')} />
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
                onClick={() => picker === 'lang' ? pickLang(o.code) : pickCur(o.code)}
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
