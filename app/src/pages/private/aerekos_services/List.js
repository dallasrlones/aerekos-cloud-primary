import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function AerekosServices() {
  const [aerekosServices, setAerekosServices] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/aerekosServices');
      setAerekosServices(res);
    })();
  }, []);

  return (
    <div>
      <ListItems items={aerekosServices} route="aerekos_services">
        {(item) => <>
          <span style={{ fontWeight: 'bold', marginLeft: 15 }}>{item.name}</span>
          <span style={{ marginLeft: 15 }}>{item.description}</span>
        </>}
      </ListItems>
      <Link to="/aerekos_services/create" style={{ marginTop: 20, display: 'block' }}>Create Aerekos Service</Link>
    </div>
  );
}