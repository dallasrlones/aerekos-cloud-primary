import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPage from '../../../components/EditPage';
import MultiSelect from '../../../components/forms/MultiSelect';
import { privateGET, privateDELETE } from '../../../services/httpService';

export default function EditStorage() {
  const { id } = useParams();
  const [storageData, setStorageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [deviceIds, setDeviceIds] = useState([]);
  const navigate = useNavigate();
  
  const handleDeviceChange = useCallback((e) => {
    setDeviceIds(e.target.value);
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [storageResponse, devicesResponse] = await Promise.all([
        privateGET(`/storage/${id}`),
        privateGET('/devices')
      ]);
      
      setStorageData(storageResponse);
      setDevices(devicesResponse);
      
      // Parse device_ids if it exists
      const initialDeviceIds = storageResponse.device_ids 
        ? (Array.isArray(storageResponse.device_ids) 
            ? storageResponse.device_ids 
            : storageResponse.device_ids.split(',').map(id => id.trim()).filter(id => id))
        : [];
      
      setDeviceIds(initialDeviceIds);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Build formObj reactively based on state changes
  const formObj = storageData ? {
    name: { 
      label: 'Storage Name', 
      type: 'text', 
      name: 'name', 
      value: storageData.name,
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description', 
      value: storageData.description,
      rows: 3
    },
    device_ids: {
      name: 'device_ids',
      value: deviceIds,
      component: (
        <MultiSelect
          name="device_ids"
          label="Attach Devices"
          placeholder="Select devices to attach..."
          value={deviceIds}
          onChange={handleDeviceChange}
          options={devices.map(device => ({
            value: device.id,
            label: `${device.name} (${device.ip_address})`,
            id: device.id,
            name: device.name
          }))}
        />
      )
    }
  } : {};

  const deleteItem = async () => {
    try {
      await privateDELETE(`/storage/${id}`);
      navigate(`/storage`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleUpdateSuccess = (response) => {
    console.log('Storage updated:', response);
    navigate(`/storage/${id}`);
  };

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: '#dc2626' }}>Error loading storage: {error.message}</div>;
  }
  
  return (
    <EditPage 
      route="storage" 
      id={id} 
      formObj={formObj} 
      deleteFunction={deleteItem}
      updateDataCallback={handleUpdateSuccess}
    />
  );
}

