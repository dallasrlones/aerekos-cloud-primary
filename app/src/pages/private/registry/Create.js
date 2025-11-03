import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateRegistry() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/registry/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Registry Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-registry',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this registry...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/registry" 
      formObj={formObj}
      title="Create Registry Service"
      subtitle="ECR-like container registry"
      submitLabel="Create Registry"
    />
  );
}
