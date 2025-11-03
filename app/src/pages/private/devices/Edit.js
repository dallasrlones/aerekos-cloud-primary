import { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import EditPage from '../../../components/EditPage';
import { privateGET, privateDELETE } from '../../../services/httpService';

export default function Edit() {
  const { id } = useParams();
  const [formObj, setFormObj] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await privateGET(`/devices/${id}`);
      const formObj = {
        name: { label: 'Device Name', type: 'text', name: 'name', value: response.name },
        api_key: { label: 'API Key', type: 'text', name: 'api_key', value: response.api_key },
        ip: { label: 'IP', type: 'text', name: 'ip', value: response.ip },
      };
      setFormObj(formObj);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const deleteDevice = async () => {
    try {
      await privateDELETE(`/devices/${id}`);
      navigate(`/devices`);
    } catch (error) {
      console.error(error);
      throw error; // Re-throw so EditPage can handle it
    }
  };

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: '#dc2626' }}>Error loading device: {error.message}</div>;
  }
  
  return (
    <EditPage route="devices" id={id} formObj={formObj} deleteFunction={deleteDevice} />
  );
}

