import React, { useEffect, useState } from 'react';
import { privateFetch } from '../../services/httpService';
import { useAuth } from '../../context/AuthContext';

export default function PrivateHome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
    //   try {
    //     const res = await privateFetch('/devices', { method: 'GET' });
    //     setData(JSON.stringify(res));
    //   } catch (err) {
    //     setData('Error: ' + err.message);
    //   }
    })();
  }, []);

  const auth = useAuth();
  const logout = async () => {
    await auth.logout();
    window.location.href = '/';
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Private Area</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
