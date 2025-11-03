import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function DatabaseDetails() {
  const { id } = useParams();
  return <DetailsPage route="database" id={id} includeKeys={['name', 'description']} />;
}
