// Cụm số dư dùng chung cho HomeSend / HomeReceive / MenuScreen — chiếm 2 hàng (row-1-2),
// con số là phần to nổi bật.
export default function BalanceHeader({ totalVND, loading }) {
  const num = loading ? '...' : (totalVND || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return (
    <div className="row-1-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: 'var(--font-condensed)' }}>
        <span style={{ fontSize: 38, fontWeight: 'var(--fw-bold)', color: 'var(--color-content)', lineHeight: 1 }}>{num}</span>
        <span style={{ fontSize: 'var(--fs-body)', color: 'var(--color-muted)' }}>VND</span>
      </div>
    </div>
  )
}
