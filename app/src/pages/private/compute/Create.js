import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateCompute() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/compute/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Compute Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-compute',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this compute...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/compute" 
      formObj={formObj}
      title="Create Compute Service"
      subtitle="EC2-like virtual machines"
      submitLabel="Create Compute"
    />
  );
}
