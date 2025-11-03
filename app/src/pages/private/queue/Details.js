import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function QueueDetails() {
  const { id } = useParams();
  return <DetailsPage route="queue" id={id} includeKeys={['name', 'description']} />;
}
