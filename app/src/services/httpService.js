const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:2222';

const storage = {
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },
  setTokens({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  },
  clear() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Callback to be set by AuthContext for handling logout
let logoutCallback = null;

function setLogoutCallback(callback) {
  logoutCallback = callback;
}

async function publicFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const r = await fetch(url, { ...opts });
  return r.json();
}

async function refreshAccessToken() {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${API_BASE}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) return null;
  const body = await res.json();
  if (body.accessToken) {
    storage.setTokens({ accessToken: body.accessToken });
    return body.accessToken;
  }
  return null;
}

async function privateFetch(path, opts = {}) {
  let token = storage.getAccessToken();
  const headers = opts.headers ? { ...opts.headers } : {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${API_BASE}${path}`;
  let res = await fetch(url, { ...opts, headers });

  // if unauthorized, try to refresh
  if (res.status === 401 || res.status === 403) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      storage.clear();
      // Trigger logout callback if available
      if (logoutCallback) {
        logoutCallback();
      }
      throw new Error('Unauthorized - Session expired');
    }
    headers['Authorization'] = `Bearer ${newToken}`;
    res = await fetch(url, { ...opts, headers });
  }

  if (res.status === 204) return null;
  const json = await res.json();
  return json;
}

async function privateGET(path, opts = {}) {
  return await privateFetch(path, { ...opts, method: 'GET' });
}

async function privatePOST(path, opts = {}) {
  return await privateFetch(path, { ...opts, method: 'POST' });
}

async function privatePUT(path, opts = {}) {
  return await privateFetch(path, { ...opts, method: 'PUT' });
}

async function privateDELETE(path, opts = {}) {
  return await privateFetch(path, { ...opts, method: 'DELETE' });
}

export { publicFetch, privateFetch, privateGET, privatePOST, privatePUT, privateDELETE, storage, refreshAccessToken, setLogoutCallback };
