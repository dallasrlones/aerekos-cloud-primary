import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function LoggingList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/logging');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Logging Instances</h3>
      <ListItems items={items} route="logging" />
      <Link to="/logging/create" style={{ marginTop: 20, display: 'block' }}>
        Create Logging
      </Link>
    </div>
  );
}
