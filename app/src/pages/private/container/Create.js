import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateContainer() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/container/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Container Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-container',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this container...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/container" 
      formObj={formObj}
      title="Create Container Service"
      subtitle="ECS-like container orchestration"
      submitLabel="Create Container"
    />
  );
}
