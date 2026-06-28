// Hàng đợi thông báo in-app (localStorage). Dùng cho HomeSend hiển thị ở vùng hint.
const KEY = 'ez_notifs'

export function getNotifs() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function addNotif(text, type = 'info', hash = null) {
  const list = getNotifs()
  list.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text, type, hash, ts: Date.now() })
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10)))
}

export function dismissNotif(id) {
  localStorage.setItem(KEY, JSON.stringify(getNotifs().filter(n => n.id !== id)))
}
