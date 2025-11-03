import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function DetailsAerekosService() {
  const { id } = useParams();
  return <DetailsPage route="aerekosServices" id={id} includeKeys={['name', 'type', 'description']} />;
}
