import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateMonitoring() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/monitoring/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Monitoring Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-monitoring',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this monitoring...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/monitoring" 
      formObj={formObj}
      title="Create Monitoring Service"
      subtitle="CloudWatch-like monitoring"
      submitLabel="Create Monitoring"
    />
  );
}
