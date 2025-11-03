import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function ServerlessDetails() {
  const { id } = useParams();
  return <DetailsPage route="serverless" id={id} includeKeys={['name', 'description']} />;
}
