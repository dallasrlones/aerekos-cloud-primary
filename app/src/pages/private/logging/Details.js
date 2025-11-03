import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function LoggingDetails() {
  const { id } = useParams();
  return <DetailsPage route="logging" id={id} includeKeys={['name', 'description']} />;
}
