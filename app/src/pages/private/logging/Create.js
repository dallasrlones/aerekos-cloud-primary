import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateLogging() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/logging/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Logging Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-logging',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this logging...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/logging" 
      formObj={formObj}
      title="Create Logging Service"
      subtitle="CloudTrail-like logging"
      submitLabel="Create Logging"
    />
  );
}
