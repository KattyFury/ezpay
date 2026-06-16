import { useNav } from '../nav'

export default function HomeSend() {
  const { navigate } = useNav()

  return (
    <div className="screen center col" style={{ gap: 16 }}>
      <span style={{ fontSize: 'var(--fs-content)', fontWeight: 'var(--fw-bold)' }}>
        Home — Phase 3
      </span>
      <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-gray)' }}>
        Chưa build
      </span>
      <button
        className="btn btn-secondary"
        style={{ width: 160, fontSize: 'var(--fs-label)' }}
        onClick={() => { localStorage.clear(); navigate('Login') }}
      >
        Reset (dev)
      </button>
    </div>
  )
}
