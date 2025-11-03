import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function LogOut() {
  const auth = useAuth();

  useEffect(() => {
    (async () => {
      await auth.logout();
      window.location.href = '/';
    })();
  }, []);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
}