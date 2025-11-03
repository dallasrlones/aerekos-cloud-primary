import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function CDNList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/cdn');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>CDN Instances</h3>
      <ListItems items={items} route="cdn" />
      <Link to="/cdn/create" style={{ marginTop: 20, display: 'block' }}>
        Create CDN
      </Link>
    </div>
  );
}
