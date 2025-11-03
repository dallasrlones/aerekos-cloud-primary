import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function RegistryList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/registry');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Registry Instances</h3>
      <ListItems items={items} route="registry" />
      <Link to="/registry/create" style={{ marginTop: 20, display: 'block' }}>
        Create Registry
      </Link>
    </div>
  );
}
