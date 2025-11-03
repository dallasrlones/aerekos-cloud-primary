import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/apikeys');
      setApiKeys(res);
    })();
  }, []);

  return (
    <div>
      <ListItems items={apiKeys} route="api_keys">
        {(item) => (
          <>
          <span style={{ fontWeight: 'bold', marginLeft: 15 }}>{item.name}</span>
          </>
        )}
      </ListItems>
      <Link to="/api_keys/create" style={{ marginTop: 20, display: 'block' }}>Create API Key</Link>
    </div>
  );
}