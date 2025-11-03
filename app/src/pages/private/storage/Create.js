import { useState, useEffect, useCallback } from 'react';
import FormContainer from '../../../components/forms/FormContainer';
import MultiSelect from '../../../components/forms/MultiSelect';
import { useNavigate } from 'react-router-dom';
import { privateGET } from '../../../services/httpService';

export default function CreateStorage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [deviceIds, setDeviceIds] = useState([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await privateGET('/devices');
        setDevices(response);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setIsLoadingDevices(false);
      }
    };
    fetchDevices();
  }, []);

  const handleSuccess = (response) => navigate(`/storage/${response.id}`);

  const handleDeviceChange = useCallback((e) => {
    setDeviceIds(e.target.value);
    setFormKey(prev => prev + 1);
  }, []);

  const formObj = {
    name: { 
      label: 'Storage Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-storage-bucket',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this storage...',
      rows: 3
    },
    device_ids: {
      name: 'device_ids',
      value: deviceIds,
      component: (
        <MultiSelect
          name="device_ids"
          label="Attach Devices"
          placeholder={isLoadingDevices ? "Loading devices..." : "Select devices to attach..."}
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
  };

  return (
    <FormContainer 
      key={formKey}
      submitCallback={handleSuccess} 
      formUrl="/storage" 
      formObj={formObj}
      title="Create Storage Service"
      subtitle="S3-like object storage"
      submitLabel="Create Storage"
    />
  );
}

