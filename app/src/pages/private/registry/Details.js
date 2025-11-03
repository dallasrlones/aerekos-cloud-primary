import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function RegistryDetails() {
  const { id } = useParams();
  return <DetailsPage route="registry" id={id} includeKeys={['name', 'description']} />;
}
