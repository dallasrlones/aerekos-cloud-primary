// create device component, device name, once created it will return a device.apiKey which we display
import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateApiKey() {
  const navigate = useNavigate();
  const createApiKey = (response) => navigate(`/api_keys/${response.id}`);

  return (
    <div>
      <h2>Create API Key</h2>
      <FormContainer submitCallback={createApiKey} formUrl="/apikeys" formObj={{ name: { label: 'API Key Name', type: 'text', name: 'name' } }} />
    </div>
  );
}