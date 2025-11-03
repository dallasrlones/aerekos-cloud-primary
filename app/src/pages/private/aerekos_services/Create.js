import FormContainer from '../../../components/forms/FormContainer';
import { useNavigate } from 'react-router-dom';

export default function CreateAerekosService() {
  const navigate = useNavigate();
  const createAerekosService = (response) => navigate(`/aerekosServices/${response.id}`);

  const formObj = {
    type: { 
      label: 'Service Type', 
      type: 'select', 
      name: 'type',
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
      helpText: 'Service name will be auto-generated from type'
    }
  };

  const createDataCallback = (response) => {
    navigate(`/aerekos_services/${response.id}`);
  };

  return (
    <div>
      <FormContainer 
        submitCallback={createDataCallback} 
        formUrl="/aerekosServices" 
        formObj={formObj}
        title="Create Aerekos Service"
        subtitle="Deploy a new service to your Aerekos Cloud infrastructure"
        submitLabel="Create Service"
      />
    </div>
  );
}
