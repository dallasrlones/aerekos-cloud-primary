import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { privateGET } from '../../../services/httpService';

// Dynamically import List components
const StorageList = lazy(() => import('../storage/List'));
const CDNList = lazy(() => import('../cdn/List'));
const DatabaseList = lazy(() => import('../database/List'));
const CacheList = lazy(() => import('../cache/List'));
const QueueList = lazy(() => import('../queue/List'));
const ComputeList = lazy(() => import('../compute/List'));
const ContainerList = lazy(() => import('../container/List'));
const ServerlessList = lazy(() => import('../serverless/List'));
const LoadBalancerList = lazy(() => import('../loadbalancer/List'));
const DNSList = lazy(() => import('../dns/List'));
const MonitoringList = lazy(() => import('../monitoring/List'));
const LoggingList = lazy(() => import('../logging/List'));
const SecretsList = lazy(() => import('../secrets/List'));
const RegistryList = lazy(() => import('../registry/List'));

const serviceComponentMap = {
  storage: StorageList,
  cdn: CDNList,
  database: DatabaseList,
  cache: CacheList,
  queue: QueueList,
  compute: ComputeList,
  container: ContainerList,
  serverless: ServerlessList,
  loadbalancer: LoadBalancerList,
  dns: DNSList,
  monitoring: MonitoringList,
  logging: LoggingList,
  secrets: SecretsList,
  registry: RegistryList
};

export default function DetailsAerekosService() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await privateGET(`/aerekosServices/${id}`);
        setService(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: '#dc2626' }}>Error: {error}</div>;
  }

  if (!service) {
    return <div style={{ padding: 20 }}>Service not found</div>;
  }

  const ListComponent = serviceComponentMap[service.type];

  return (
    <div style={{ padding: 20 }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
          {service.name}
        </h1>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>
          Type: <span style={{ 
            padding: '4px 12px', 
            background: '#f1f5f9', 
            borderRadius: '6px',
            fontWeight: '600',
            color: '#667eea'
          }}>
            {service.type}
          </span>
        </p>
        {service.description && (
          <p style={{ color: '#475569' }}>{service.description}</p>
        )}
      </div>

      <div className="card">
        {ListComponent ? (
          <Suspense fallback={<div style={{ padding: 20 }}>Loading instances...</div>}>
            <ListComponent />
          </Suspense>
        ) : (
          <div style={{ padding: 20, color: '#64748b' }}>
            No list component available for type: {service.type}
          </div>
        )}
      </div>
    </div>
  );
}
