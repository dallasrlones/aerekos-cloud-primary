import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateDNS() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/dns/\${response.id}`);

  const formObj = {
    name: { 
      label: 'DNS Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-dns',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this dns...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/dns" 
      formObj={formObj}
      title="Create DNS Service"
      subtitle="Route53-like DNS management"
      submitLabel="Create DNS"
    />
  );
}
