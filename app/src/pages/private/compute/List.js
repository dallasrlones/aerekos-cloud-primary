import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function ComputeList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/compute');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Compute Instances</h3>
      <ListItems items={items} route="compute" />
      <Link to="/compute/create" style={{ marginTop: 20, display: 'block' }}>
        Create Compute
      </Link>
    </div>
  );
}
