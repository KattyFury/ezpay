// Lưu trữ cục bộ TÁCH THEO TỪNG VÍ — danh bạ & kho QR riêng cho mỗi tài khoản.
// Trước đây dùng key chung (ez_contacts, ez_saved_qrs) → đăng nhập tài khoản khác
// vẫn thấy danh bạ tài khoản cũ. Giờ key gắn theo địa chỉ ví đang đăng nhập.
// KHÔNG cần database: mỗi máy/mỗi tài khoản giữ dữ liệu của mình trong localStorage.

function acct() {
  return (localStorage.getItem('ez_wallet_addr') || 'anon').toLowerCase()
}

// Migrate 1 lần: dữ liệu key-chung cũ → gán cho tài khoản đang đăng nhập, rồi xóa key chung
function migrate(base) {
  const oldKey = `ez_${base}`
  const newKey = `ez_${base}_${acct()}`
  const old = localStorage.getItem(oldKey)
  if (old && acct() !== 'anon' && !localStorage.getItem(newKey)) {
    localStorage.setItem(newKey, old)
    localStorage.removeItem(oldKey)
  }
}

function load(base) {
  migrate(base)
  try { return JSON.parse(localStorage.getItem(`ez_${base}_${acct()}`) || '[]') } catch { return [] }
}
function save(base, list) {
  localStorage.setItem(`ez_${base}_${acct()}`, JSON.stringify(list))
}

export function loadContacts() { return load('contacts') }
export function saveContacts(list) { save('contacts', list) }
export function loadSavedQRs() { return load('saved_qrs') }
export function saveSavedQRs(list) { save('saved_qrs', list) }

export function findContactName(addr) {
  try {
    return loadContacts().find(c => c.address?.toLowerCase() === addr?.toLowerCase())?.name || null
  } catch { return null }
}
