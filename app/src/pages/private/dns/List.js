import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function DNSList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/dns');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>DNS Instances</h3>
      <ListItems items={items} route="dns" />
      <Link to="/dns/create" style={{ marginTop: 20, display: 'block' }}>
        Create DNS
      </Link>
    </div>
  );
}
