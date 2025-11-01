import React, { useState } from 'react';
import { publicFetch } from '../../services/httpService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await publicFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: (email || '').toLowerCase(), password })
      });
      setMsg(res.message || 'Registered');
      // if server returns tokens after registration, log in automatically
      if (res.accessToken) {
        auth.login({ accessToken: res.accessToken, refreshToken: res.refreshToken });
        navigate('/private');
      }
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </div>
        <div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        </div>
        <button>Register</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
