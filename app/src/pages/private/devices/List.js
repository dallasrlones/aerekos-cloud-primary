import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function Devices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/devices');
      setDevices(res);
    })();
  }, []);

  return (
    <div>
      <ListItems items={devices} route="devices">
        {(item) => <>
          <span>
            {item.ip ? <span style={{ color: 'green' }}>ONLINE</span> : <span style={{ color: 'red' }}>OFFLINE</span>}
          </span>
          <span style={{ fontWeight: 'bold', marginLeft: 15 }}>{item.name}</span>
        </>}
      </ListItems>
      <Link to="/devices/create" style={{ marginTop: 20, display: 'block' }}>Create Device</Link>
    </div>
  );
}