# HANDOFF — EZwallet

**Cập nhật:** 2026-06-26
**Repo:** https://github.com/KattyFury/ezwallet
**Local:** `D:\Files\Claude_laptop\Build_on_Arc\ezwallet`
**Live:** https://ezwallet.pages.dev (Cloudflare Pages, auto-deploy từ GitHub `main`)

> App ví stablecoin cho người dùng phổ thông / người già. UX phải đơn giản, rõ ràng, mobile-first. Chỉ hiển thị VND.
> Nguyên tắc: **CHẠY TECH CHUẨN của Circle, đọc docs trước khi làm, không đoán.**

---

## Stack

- **Frontend:** React + Vite → Cloudflare Pages
- **Backend:** Cloudflare Functions (`functions/api/*.js`) — gọi Circle API server-side
- **Wallet:** Circle **User-Controlled Wallet** (MPC, user ký bằng PIN qua W3S Web SDK `@circle-fin/w3s-pw-web-sdk`)
- **Auth:** Email (Circle session) — Google/Facebook DISABLE (xem phần Blocked)
- **Chain:** Arc Testnet · Chain ID `5042002` · RPC `https://rpc.testnet.arc.network` · Explorer `testnet.arcscan.app`
- **Balance:** đọc thẳng on-chain bằng viem (`src/chain.js`), không qua Circle

**Token addresses (Arc Testnet):**
| Token | Address | Decimals | Giá VND |
|---|---|---|---|
| USDC | `0x3600000000000000000000000000000000000000` | 6 | hardcode 25.000 |
| EURC | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` | 6 | hardcode 27.000 |
| cirBTC | `0xf0c4a4ce82a5746abaad9425360ab04fbba432bf` | 8 | CoinGecko `bitcoin`, cache 60s |

**Secrets** (`.env.txt` — gitignored; cũng phải set trên Cloudflare Dashboard):
- `API_KEY` — Circle API key
- `KIT_KEY` — Stablecoin Kit key (cho swap quote)

**Dev local (Windows — KHÔNG dùng `wrangler pages dev`, lỗi "write EOF"):**
- Terminal 1: `node dev-server.js` (proxy Circle API, port 8787)
- Terminal 2: `npm run dev` (Vite, port 5173) — Vite proxy `/api` → 8787

**ID hardcode** (`src/circle.js`, không phải secret):
- APP_ID `518fec6a-4680-5175-9de6-0810fb3dfd04`
- GOOGLE_CLIENT_ID `51031114717-f9chve1ge9bbo8j3kspj82qrga40342n.apps.googleusercontent.com`

---

## Design System

**Font:** Roboto Condensed (400 / 500 / 700)

**Màu (6 + muted):** `--color-primary #16A34A` · `--color-black #000` · `--color-gray #CCCCCC` (chỉ border/background) · `--color-muted #999999` (text phụ) · `--color-white #FFF` · `--color-error #DC2626` · `--color-warning #F59E0B`

**Typography scale (mobile, hiện hành):**
| Variable | Size | Dùng cho |
|---|---|---|
| `--fs-amount` | 45px | Số tiền lớn |
| `--fs-title` | 22px | Tiêu đề màn |
| `--fs-body` | 18px | Nội dung, button |
| `--fs-item` | 16px | Item list |
| `--fs-label` | 15px | Label, placeholder, text phụ |

**Assets:**
- `icon/` — line icons 100×100: back, up, down, left, right, trade, menu, email, google, facebook, hint (bóng đèn), copy, qr, qr-white, danhba, share, download, add, add-white, verified
- `design/` — logo-long, logo-short, PFP, app-icon, pattern*
- `public/tokens/` — usdc.png, eurc.png, cirbtc.png (logo token thật, lấy từ CoinGecko)

---

## Layout Rules (quan trọng)

- **Lưới 10 hàng** theo chiều cao màn (`.screen` grid-template-rows: repeat(10,1fr), height 100dvh, padding 0 15px)
- **Sub-screen:** hàng 1 = tiêu đề (center, không line xám ngăn cách), hàng 10 = action buttons
- **4 màn chính:** nav bar ở hàng 10
- **Row 10:** 1 nút = `row10-single` (width 2/3); 2 nút = trái phụ trắng / phải chính xanh. (Lưu ý: `row10-dual` chiếm grid-row 9/11 — KHÔNG dùng chung màn có numpad.)
- **Numpad:** LUÔN ở `row-7-9` (grid-row 7/10), đồng bộ mọi màn (SendAmount, Swap, EnterPin, CreatePin, CreateQR). Màn có numpad → nút bottom đặt riêng ở **hàng 10** (không dùng row10-dual để tránh đè).
- **⚠ Input text (email, địa chỉ ví, tên, ảnh) PHẢI ở hàng 1–4 hoặc trong popup neo nửa trên.** Bàn phím iPhone che ~1/2 dưới (hàng 5–10). Popup form (vd thêm danh bạ) dùng overlay `align-items: flex-start` + paddingTop để nằm vùng trên.
- **Không dùng line xám ngăn cách** (border-bottom) ở header/list — đã bỏ toàn bộ.

---

## Trạng thái màn hình (hiện tại)

- **Login:** 2 nút — Email (active), Google (disabled mờ 0.4). Facebook đã gỡ.
- **EnterEmail:** tiêu đề "Đăng nhập với Email"; input absolute-center ở row-3; gợi ý email history + domain (`@gmail`/`@yahoo`/`@icloud`) cùng style box xám chữ đen.
- **HomeSend:** Số dư căn trái "Số dư: X.XXX.XXX VND" (row 1-5 grid 5 hàng đều nhau) + list token (logo thật + tên + verified.png + VND); hint "Cách gửi tiền" (weight medium) ở hàng 7-8; actions hàng 9 (Danh bạ / Quét QR / Dán để gửi); nav hàng 10.
- **Contacts (Danh bạ):** list không line xám; popup Thêm neo nửa trên có avatar tròn (xám + add-white) → chọn ảnh → **cropper zoom/pan tròn** → lưu PFP; nút Thêm icon 16px = cỡ chữ.
- **QRScanner:** ô vuông camera giữa hàng 1-5 (khung 4 góc); hàng 10: "Ảnh QR" (trắng, trái — đọc QR từ thư viện) / "Quay lại" (xanh, phải).
- **PasteAddress:** input nhỏ row-3 + nút "Dán" cùng hàng `[0x...][Dán]`.
- **SendAmount:** h1 "Gửi tiền" / h2 "Gửi cho: tên|ví" / h3-4 số tiền 40px / h5 memo / numpad h7-9 / nút h10. (Số dư check còn dùng MOCK_VND — chưa nối số dư thật.)
- **SendConfirm → SendReceipt:** recap VND+USDC, nút đỏ "Xác nhận · PIN".
- Khác: HomeReceive (QR nhận), Swap, MenuScreen, TxHistory (ArcScan), Language/Security/About, CreateQR/ShowQR/SavedQRList, EnterPin/CreatePin/PinLocked/ForgotPin.

---

## Hoạt động được vs Blocked

**✅ Chạy thật:**
- Email login → tạo ví → HomeSend
- Balance đọc thật từ Arc RPC (viem)
- **Send/Transfer** — `functions/api/send.js` ERC-20 `transfer(address,uint256)` → Circle contractExecution → W3S PIN. **Verified COMPLETE on-chain.**
- Swap **estimate** (hiển thị tỷ giá)
- TxHistory, Contacts, QRScanner, Reset PIN

**❌ Blocked (đã disable trong UI, chờ Circle):**
- **Swap execute:** App Kit/Swap Kit KHÔNG có adapter cho User-Controlled Wallet (chỉ có viem private-key / browser / circle-wallets dev-controlled). Manual instruction-replay fail on-chain. → Tab "Đổi tiền" trên nav bar đã disable; giữ estimate. Đã gửi bug report Circle.
- **Google/Facebook login:** iframe `pw-auth.circle.com/social/verify-token` không post back → `onLoginComplete` không fire. → disable, chờ Circle. Bật lại: đổi `disabled: true→false` trong `src/screens/Login.jsx`.

---

## Bài học / Gotchas (đừng lặp lại)

- Circle có **2 format chain ID khác nhau:** W3S API dùng `ARC-TESTNET`, Stablecoin Kit API dùng `Arc_Testnet`.
- REST `/user/transactions/contractExecution` cần **`feeLevel: 'MEDIUM'` (field phẳng)**, KHÔNG phải `fee: {type, config}` (đó là format Node SDK).
- Lấy wallet address: `GET /v1/w3s/wallets` + header `X-User-Token` (KHÔNG có `/user/wallets`).
- Swap response: `transaction.executionParams.instructions[]` (mảng approve+swap), không phải `transaction.target/callData`. Estimate: `res.estimate.quote.estimatedAmount`.
- W3S SDK `performLogin(provider)` — **1 tham số** (`'Google'`). Đừng tin WebFetch summary, đọc SDK source.
- Circle SDK popup KHÔNG chạy trên localhost (thiếu crypto polyfill) → tạo ví test trên deployed. Balance qua viem chạy được local.

---

## Pending / TODO

1. **Memo:** sẽ triển khai theo **docs Arc** (user sẽ gửi docs). Hiện memo chỉ pass qua UI, chưa lên chain. ⏸ chờ docs.
2. Nối **số dư thật** vào SendAmount (đang dùng MOCK_VND).
3. Send: mới chỉ USDC — chưa chọn token khác.
4. Fix manifest icon `design/app-icon.png` ("invalid image", cosmetic).
5. Account Recovery (Reset PIN đã có).
6. Khi Circle phản hồi → bật lại Google/Facebook + Swap execute.
