// create device component, device name, once created it will return a device.apiKey which we display
import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateDevice() {
  const navigate = useNavigate();
  const createDevice = (response) => navigate(`/devices/${response.id}`);

  return (
    <div>
      <h2>Create Device</h2>
      <FormContainer submitCallback={createDevice} formUrl="/devices" formObj={{ name: { label: 'Device Name', type: 'text', name: 'name' } }} />
    </div>
  );
}