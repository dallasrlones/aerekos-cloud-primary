import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function ComputeDetails() {
  const { id } = useParams();
  return <DetailsPage route="compute" id={id} includeKeys={['name', 'description']} />;
}
