// create device component, device name, once created it will return a device.apiKey which we display
import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
  const navigate = useNavigate();
  const createProject = (response) => navigate(`/projects/${response.id}`);

  return (
    <div>
      <h2>Create Project</h2>
      <FormContainer submitCallback={createProject} formUrl="/projects" formObj={{ name: { label: 'Project Name', type: 'text', name: 'name' }, description: { label: 'Project Description', type: 'text', name: 'description' } }} />
    </div>
  );
}