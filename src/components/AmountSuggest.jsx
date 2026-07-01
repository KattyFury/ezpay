// Gợi ý nhanh khi nhập VND — tỉ giá lệch quá xa so với USD (1 USDC ≈ 25.000đ) nên
// gõ tay rất dài dòng. Nhập "20" → gợi ý 20.000 / 200.000 / 2.000.000 (x1.000/x10.000/x100.000).
// Chỉ hiện khi số đang gõ còn NGẮN (≤3 chữ số) — số dài hơn coi như người dùng đã gõ đủ ý,
// tự nhân thêm sẽ ra số vô lý.
const MULTIPLIERS = [1000, 10000, 100000]

export default function AmountSuggest({ cur, amount, digits, onPick, fmtNum }) {
  if (cur !== 'VND' || !digits || digits.length > 3 || amount <= 0) return null

  return (
    <div className="row-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {MULTIPLIERS.map(m => (
        <button key={m} onClick={() => onPick(amount * m)}
          style={{
            padding: '6px 14px', border: '1.5px solid var(--color-gray)', borderRadius: 20,
            background: 'var(--color-white)', cursor: 'pointer',
            fontFamily: 'var(--font-condensed)', fontSize: 'var(--fs-label)', fontWeight: 'var(--fw-medium)',
            color: 'var(--color-content)',
          }}>
          {fmtNum(amount * m, 'VND')}
        </button>
      ))}
    </div>
  )
}
