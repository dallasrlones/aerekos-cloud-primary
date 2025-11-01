import React, { useState } from 'react';
import { publicFetch } from '../../services/httpService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const auth = useAuth();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await publicFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: (email || '').toLowerCase(), password })
      });
      if (res.accessToken) {
        auth.login({ accessToken: res.accessToken, refreshToken: res.refreshToken });
        navigate('/private');
      } else {
        setMsg(res.message || 'Login failed');
      }
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        </div>
        <button>Login</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
