import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateQueue() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/queue/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Queue Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-queue',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this queue...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/queue" 
      formObj={formObj}
      title="Create Queue Service"
      subtitle="SQS-like message queue"
      submitLabel="Create Queue"
    />
  );
}
