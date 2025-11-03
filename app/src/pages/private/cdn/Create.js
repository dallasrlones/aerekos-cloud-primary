import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateCDN() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/cdn/\${response.id}`);

  const formObj = {
    name: { 
      label: 'CDN Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-cdn',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this cdn...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/cdn" 
      formObj={formObj}
      title="Create CDN Service"
      subtitle="CloudFront-like content delivery"
      submitLabel="Create CDN"
    />
  );
}
