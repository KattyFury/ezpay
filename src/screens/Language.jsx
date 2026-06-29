import { useState } from 'react'
import { useNav } from '../nav'
import Icon from '../components/Icon'
import { t, getLang, setLang as applyLang } from '../i18n'

// 3 ngôn ngữ chính (tên hiển thị bằng chính ngôn ngữ đó)
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文 (Tiếng Trung)' },
  { code: 'vi', label: 'Tiếng Việt' },
]

// 4 tiền tệ: ưu tiên stablecoin (USDC/EURC) + tiền Trung/Việt
const CURRENCIES = [
  { code: 'USDC', label: 'USDC – USD stablecoin' },
  { code: 'EURC', label: 'EURC – Euro stablecoin' },
  { code: 'CNY', label: 'CNY – ' + t('Nhân dân tệ') },
  { code: 'VND', label: 'VND – ' + t('Việt Nam Đồng') },
]

export default function Language() {
  const { navigate } = useNav()
  const lang = getLang()
  const [currency, setCurrency] = useState(() => localStorage.getItem('ez_currency') || 'USDC')
  const [picker, setPicker] = useState(null) // 'lang' | 'currency' | null

  const langLabel = LANGUAGES.find(l => l.code === lang)?.label || 'English'

  function pickLang(code) { setPicker(null); if (code !== lang) applyLang(code) /* reload */ }
  function pickCur(code) { setCurrency(code); localStorage.setItem('ez_currency', code); setPicker(null) }

  const Row = ({ label, value, onClick }) => (
    <button className="menu-item" style={{ width: '100%' }} onClick={onClick}>
      <span style={{ flex: 1, fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
      <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-content)', border: '1.5px solid var(--color-gray)', borderRadius: 8, padding: '4px 12px', marginRight: 8 }}>{value}</span>
      <Icon name="right2" size={15} color="var(--color-faint)" />
    </button>
  )

  const list = picker === 'lang' ? LANGUAGES : CURRENCIES
  const active = picker === 'lang' ? lang : currency
  const onPick = picker === 'lang' ? pickLang : pickCur

  return (
    <div className="screen">
      <div className="row-1 center screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)' }}>
        {t('Ngôn ngữ & tiền tệ')}
      </div>

      <div className="row-2" style={{ display: 'flex', alignItems: 'center' }}>
        <Row label={t('Ngôn ngữ')} value={langLabel} onClick={() => setPicker('lang')} />
      </div>
      <div className="row-3" style={{ display: 'flex', alignItems: 'center' }}>
        <Row label={t('Tiền tệ')} value={currency} onClick={() => setPicker('currency')} />
      </div>

      <div className="row-10 row10-single">
        <button className="btn btn-primary" onClick={() => navigate('MenuScreen')}>{t('Quay lại')}</button>
      </div>

      {picker && (
        <div onClick={() => setPicker(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 340, background: 'var(--color-white)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '80dvh', overflowY: 'auto' }}>
            <div className="screen-title" style={{ fontSize: 'var(--fs-title)', fontWeight: 'var(--fw-medium)', textAlign: 'center', marginBottom: 4 }}>
              {picker === 'lang' ? t('Chọn ngôn ngữ') : t('Chọn tiền tệ')}
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
