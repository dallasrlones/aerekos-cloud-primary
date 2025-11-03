import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function StorageList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/storage');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Storage Instances</h3>
      <ListItems items={items} route="storage" />
      <Link to="/storage/create" style={{ marginTop: 20, display: 'block' }}>
        Create Storage
      </Link>
    </div>
  );
}
