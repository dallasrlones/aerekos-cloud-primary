import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function SecretsDetails() {
  const { id } = useParams();
  return <DetailsPage route="secrets" id={id} includeKeys={['name', 'description']} />;
}
