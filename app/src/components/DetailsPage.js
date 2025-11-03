import React, { useState, useEffect } from 'react';
import { privateGET } from '../services/httpService';

export default function DetailsPage({ route, id, includeKeys = [] }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await privateGET(`/${route}/${id}`);
      setData(includeKeys.reduce((acc, key) => {
        acc[key] = res[key];
        return acc;
      }, {}));
      setLoading(false)
    } catch (error) {
      setError(error);
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {/* the response will be a json object, the key is the label and the value the value of the key */}
      {Object.entries(data).map(([label, value]) => (
        <div key={label}>
          <h2>{label}</h2>
          <p>{value}</p>
        </div>
      ))}
    </div>
  );
}
