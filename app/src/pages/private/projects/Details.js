import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function DetailsProject() {
  const { id } = useParams();
  return <DetailsPage route="projects" id={id} includeKeys={['name', 'description']} />;
}
