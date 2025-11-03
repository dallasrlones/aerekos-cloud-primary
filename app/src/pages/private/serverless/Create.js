import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateServerless() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/serverless/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Serverless Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-serverless',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this serverless...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/serverless" 
      formObj={formObj}
      title="Create Serverless Service"
      subtitle="Lambda-like serverless functions"
      submitLabel="Create Serverless"
    />
  );
}
