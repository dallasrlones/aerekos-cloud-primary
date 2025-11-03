import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateLoadBalancer() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/loadbalancer/\${response.id}`);

  const formObj = {
    name: { 
      label: 'LoadBalancer Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-loadbalancer',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this loadbalancer...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/loadbalancer" 
      formObj={formObj}
      title="Create LoadBalancer Service"
      subtitle="ELB-like load balancing"
      submitLabel="Create LoadBalancer"
    />
  );
}
