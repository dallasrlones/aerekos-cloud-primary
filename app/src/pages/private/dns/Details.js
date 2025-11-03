import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function DNSDetails() {
  const { id } = useParams();
  return <DetailsPage route="dns" id={id} includeKeys={['name', 'description']} />;
}
