import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function ServerlessList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/serverless');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Serverless Instances</h3>
      <ListItems items={items} route="serverless" />
      <Link to="/serverless/create" style={{ marginTop: 20, display: 'block' }}>
        Create Serverless
      </Link>
    </div>
  );
}
