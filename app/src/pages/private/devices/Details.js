import DetailsPage from '../../../components/DetailsPage';
import { useParams } from 'react-router-dom';

export default function Details() {
  const { id } = useParams();
  return <DetailsPage route="devices" id={id} includeKeys={[
    'last_seen',
    'os',
    'os_version',
    'ip',
    'cpu_cores',
    'hostname',
    'memory_gb',
    'cpu_model',
    'name',
    'os_name',
    'architecture'
  ]} />;
}
