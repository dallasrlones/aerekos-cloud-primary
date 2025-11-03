import { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import EditPage from '../../../components/EditPage';
import { privateGET, privateDELETE } from '../../../services/httpService';

export default function EditAerekosService() {
  const { id } = useParams();
  const [formObj, setFormObj] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await privateGET(`/aerekosServices/${id}`);
      const formObj = {
        type: { 
          label: 'Service Type', 
          type: 'select', 
          name: 'type', 
          value: response.type,
          required: true,
          options: [
            { value: 'storage', label: 'Storage (S3-like)' },
            { value: 'cdn', label: 'CDN (CloudFront-like)' },
            { value: 'database', label: 'Database (RDS-like)' },
            { value: 'cache', label: 'Cache (ElastiCache-like)' },
            { value: 'queue', label: 'Queue (SQS-like)' },
            { value: 'compute', label: 'Compute (EC2-like)' },
            { value: 'container', label: 'Container (ECS-like)' },
            { value: 'serverless', label: 'Serverless (Lambda-like)' },
            { value: 'loadbalancer', label: 'Load Balancer (ELB-like)' },
            { value: 'dns', label: 'DNS (Route53-like)' },
            { value: 'monitoring', label: 'Monitoring (CloudWatch-like)' },
            { value: 'logging', label: 'Logging (CloudTrail-like)' },
            { value: 'secrets', label: 'Secrets (Secrets Manager-like)' },
            { value: 'registry', label: 'Registry (ECR-like)' }
          ],
          helpText: 'Changing type will update the service name'
        },
        description: { 
          label: 'Description', 
          type: 'textarea', 
          name: 'description', 
          value: response.description,
          required: true,
          rows: 3,
          helpText: 'Brief description of the service purpose'
        }
      };
      setFormObj(formObj);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const deleteAerekosService = async () => {
    try {
      await privateDELETE(`/aerekosServices/${id}`);
      navigate(`/aerekos_services`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateDataCallback = (response) => {
    navigate(`/aerekos_services/${id}`);
  };

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: '#dc2626' }}>Error loading aerekos service: {error.message}</div>;
  }
  
  return (
    <EditPage route="aerekosServices" updateDataCallback={updateDataCallback} id={id} formObj={formObj} deleteFunction={deleteAerekosService} />
  );
}

