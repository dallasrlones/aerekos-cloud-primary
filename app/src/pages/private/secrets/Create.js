import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateSecrets() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/secrets/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Secrets Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-secrets',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this secrets...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/secrets" 
      formObj={formObj}
      title="Create Secrets Service"
      subtitle="Secrets Manager-like secret storage"
      submitLabel="Create Secrets"
    />
  );
}
