import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function Details() {
  const { id } = useParams();
  return <DetailsPage route="devices" id={id} includeKeys={['name', 'api_key', 'ip']} />;
}
