import { useState } from 'react'
import { useNav } from '../nav'
import Icon from '../components/Icon'

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English (Anh)' },
  { code: 'es', label: 'Español (Tây Ban Nha)' },
  { code: 'zh', label: '中文 (Trung)' },
  { code: 'ja', label: '日本語 (Nhật)' },
]

// Ưu tiên stablecoin: nước có stablecoin thì hiện stablecoin (USDC/EURC) thay vì USD/EUR
const CURRENCIES = [
  { code: 'VND', label: 'VND – Việt Nam Đồng' },
  { code: 'USDC', label: 'USDC – USD stablecoin' },
  { code: 'EURC', label: 'EURC – Euro stablecoin' },
  { code: 'CNY', label: 'CNY – Nhân dân tệ' },
  { code: 'JPY', label: 'JPY – Yên Nhật' },
]

export default function Language() {
  const { navigate } = useNav()
  const [lang, setLang] = useState(() => localStorage.getItem('ez_lang') || 'vi')
  const [currency, setCurrency] = useState(() => localStorage.getItem('ez_currency') || 'VND')
  const [picker, setPicker] = useState(null) // 'lang' | 'currency' | null

  const langLabel = LANGUAGES.find(l => l.code === lang)?.label || 'Tiếng Việt'
  const curLabel = CURRENCIES.find(c => c.code === currency)?.code || 'VND'

  function pickLang(code) { setLang(code); localStorage.setItem('ez_lang', code); setPicker(null) }
  function pickCur(code) { setCurrency(code); localStorage.setItem('ez_currency', code); setPicker(null) }

  const Row = ({ label, value, onClick }) => (
    <button className="menu-item" style={{ width: '100%' }} onClick={onClick}>
      <span style={{ flex: 1, fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
      <span style={{ fontSize: 'var(--fs-item)', color: 'var(--color-muted)', marginRight: 6 }}>{value}</span>
      <Icon name="right" size={18} color="var(--color-faint)" />
    </button>
  )

  const list = picker === 'lang' ? LANGUAGES : CURRENCIES
  const active = picker === 'lang' ? lang : currency
  const onPick = picker === 'lang' ? pickLang : pickCur

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)' }}>
        Ngôn ngữ & tiền tệ
      </div>

      <div className="row-2" style={{ display: 'flex', alignItems: 'center' }}>
        <Row label="Ngôn ngữ" value={langLabel} onClick={() => setPicker('lang')} />
      </div>
      <div className="row-3" style={{ display: 'flex', alignItems: 'center' }}>
        <Row label="Tiền tệ" value={curLabel} onClick={() => setPicker('currency')} />
      </div>

      <div className="row-10 row10-single">
        <button className="btn btn-primary" onClick={() => navigate('MenuScreen')}>Quay lại</button>
      </div>

      {/* Popup chọn ngôn ngữ / tiền tệ */}
      {picker && (
        <div onClick={() => setPicker(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 340, background: 'var(--color-white)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '80dvh', overflowY: 'auto' }}>
            <div className="screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-bold)', textAlign: 'center', marginBottom: 4 }}>
              {picker === 'lang' ? 'Chọn ngôn ngữ' : 'Chọn tiền tệ'}
            </div>
            {list.map(o => (
              <button key={o.code} onClick={() => onPick(o.code)}
                className={`btn ${o.code === active ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 18 }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
