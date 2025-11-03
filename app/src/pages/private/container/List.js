import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function ContainerList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/container');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Container Instances</h3>
      <ListItems items={items} route="container" />
      <Link to="/container/create" style={{ marginTop: 20, display: 'block' }}>
        Create Container
      </Link>
    </div>
  );
}
