import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function LoadBalancerList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/loadbalancer');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>LoadBalancer Instances</h3>
      <ListItems items={items} route="loadbalancer" />
      <Link to="/loadbalancer/create" style={{ marginTop: 20, display: 'block' }}>
        Create LoadBalancer
      </Link>
    </div>
  );
}
