import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateCache() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/cache/${response.id}`);

  const formObj = {
    name: { 
      label: 'Cache Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-cache',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this cache...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/cache" 
      formObj={formObj}
      title="Create Cache Service"
      subtitle="ElastiCache-like caching"
      submitLabel="Create Cache"
    />
  );
}
