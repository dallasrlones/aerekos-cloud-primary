import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function SecretsList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/secrets');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Secrets Instances</h3>
      <ListItems items={items} route="secrets" />
      <Link to="/secrets/create" style={{ marginTop: 20, display: 'block' }}>
        Create Secrets
      </Link>
    </div>
  );
}
