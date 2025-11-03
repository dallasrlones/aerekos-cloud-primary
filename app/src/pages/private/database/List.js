import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function DatabaseList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/database');
      setItems(res);
    })();
  }, []);

  return (
    <div>
      <h3>Database Instances</h3>
      <ListItems items={items} route="database" />
      <Link to="/database/create" style={{ marginTop: 20, display: 'block' }}>
        Create Database
      </Link>
    </div>
  );
}
