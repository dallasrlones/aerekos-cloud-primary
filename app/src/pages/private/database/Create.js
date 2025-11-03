import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateDatabase() {
  const navigate = useNavigate();
  const handleSuccess = (response) => navigate(`/database/\${response.id}`);

  const formObj = {
    name: { 
      label: 'Database Name', 
      type: 'text', 
      name: 'name',
      placeholder: 'my-database',
      required: true
    },
    description: { 
      label: 'Description', 
      type: 'textarea', 
      name: 'description',
      placeholder: 'Describe this database...',
      rows: 3
    }
  };

  return (
    <FormContainer 
      submitCallback={handleSuccess} 
      formUrl="/database" 
      formObj={formObj}
      title="Create Database Service"
      subtitle="RDS-like relational database"
      submitLabel="Create Database"
    />
  );
}
