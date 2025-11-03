import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DetailsPage from '../../../components/DetailsPage';
import { privateGET } from '../../../services/httpService';

export default function StorageDetails() {
  const { id } = useParams();
  const [storage, setStorage] = useState(null);
  const [attachedDevices, setAttachedDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStorageDetails = async () => {
      try {
        const storageResponse = await privateGET(`/storage/${id}`);
        setStorage(storageResponse);

        // Fetch device details if device_ids exist
        if (storageResponse.device_ids) {
          const deviceIds = Array.isArray(storageResponse.device_ids)
            ? storageResponse.device_ids
            : storageResponse.device_ids.split(',').map(id => id.trim());

          if (deviceIds.length > 0) {
            const allDevices = await privateGET('/devices');
            const devices = allDevices.filter(device => deviceIds.includes(device.id));
            setAttachedDevices(devices);
          }
        }
      } catch (error) {
        console.error('Error fetching storage details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStorageDetails();
  }, [id]);

  return (
    <div>
      <DetailsPage route="storage" id={id} includeKeys={['name', 'description']} />
      
      {!isLoading && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#334155' }}>
            Attached Devices
          </h3>
          {attachedDevices.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>No devices attached</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {attachedDevices.map(device => (
                <Link
                  key={device.id}
                  to={`/devices/${device.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                      {device.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {device.ip_address}
                    </div>
                  </div>
                  <span style={{ color: '#667eea', fontSize: '20px' }}>→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

