import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function CacheDetails() {
  const { id } = useParams();
  return <DetailsPage route="cache" id={id} includeKeys={['name', 'description']} />;
}
