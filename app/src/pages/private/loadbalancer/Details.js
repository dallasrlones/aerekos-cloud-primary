import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function LoadBalancerDetails() {
  const { id } = useParams();
  return <DetailsPage route="loadbalancer" id={id} includeKeys={['name', 'description']} />;
}
