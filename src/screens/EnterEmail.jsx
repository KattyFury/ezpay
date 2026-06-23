import { useState } from 'react';
import { useNav } from '../nav';
import { createSession, getSDK, initializeWallet, executeChallenge } from '../circle';

export default function EnterEmail() {
  const { navigate } = useNav();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit() {
    if (!valid || loading) return;
    setLoading(true);
    setError('');
    try {
      const { userToken, encryptionKey } = await createSession(email.trim());
      localStorage.setItem('ez_user_token', userToken);
      localStorage.setItem('ez_encryption_key', encryptionKey);
      localStorage.setItem('ez_email', email.trim());

      const sdk = getSDK();
      const walletData = await initializeWallet(userToken);
      const challengeId = walletData?.data?.challengeId;

      if (challengeId) {
        await executeChallenge(sdk, userToken, encryptionKey, challengeId);
      }

      navigate('HomeSend');
    } catch (e) {
      setError(e.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <div className="row-1 center send-title" style={{ justifyContent: 'center' }}>
        <span>Đăng nhập</span>
      </div>

      <div className="row-2-5 col" style={{ justifyContent: 'center', gap: 12 }}>
        <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-muted)' }}>Địa chỉ email</span>
        <input
          type="email"
          className="address-input"
          placeholder="example@email.com"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
          style={{ height: 44, fontSize: 'var(--fs-body)' }}
        />
        {error && <span style={{ fontSize: 'var(--fs-label)', color: 'var(--color-error)' }}>{error}</span>}
      </div>

      <div className="row-9 row10-dual">
        <button className="btn btn-secondary" onClick={() => navigate('Login')}>
          Quay lại
        </button>
        <button
          className="btn btn-primary"
          disabled={!valid || loading}
          onClick={handleSubmit}
        >
          {loading ? 'Đang xử lý...' : 'Tiếp tục'}
        </button>
      </div>
    </div>
  );
}
