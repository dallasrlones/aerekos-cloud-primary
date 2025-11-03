import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function MonitoringList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/monitoring');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Monitoring Instances</h3>
      <ListItems items={items} route="monitoring" />
      <Link to="/monitoring/create" style={{ marginTop: 20, display: 'block' }}>
        Create Monitoring
      </Link>
    </div>
  );
}
