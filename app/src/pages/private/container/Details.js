import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function ContainerDetails() {
  const { id } = useParams();
  return <DetailsPage route="container" id={id} includeKeys={['name', 'description']} />;
}
