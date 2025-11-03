import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function MonitoringDetails() {
  const { id } = useParams();
  return <DetailsPage route="monitoring" id={id} includeKeys={['name', 'description']} />;
}
