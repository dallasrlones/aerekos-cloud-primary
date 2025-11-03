import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function CDNDetails() {
  const { id } = useParams();
  return <DetailsPage route="cdn" id={id} includeKeys={['name', 'description']} />;
}
