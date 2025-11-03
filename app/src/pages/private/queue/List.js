import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function QueueList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/queue');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Queue Instances</h3>
      <ListItems items={items} route="queue" />
      <Link to="/queue/create" style={{ marginTop: 20, display: 'block' }}>
        Create Queue
      </Link>
    </div>
  );
}
