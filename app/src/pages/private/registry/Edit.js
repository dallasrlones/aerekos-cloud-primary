import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditPage from '../../../components/EditPage';
import { privateGET, privateDELETE } from '../../../services/httpService';

export default function EditRegistry() {
  const { id } = useParams();
  const [formObj, setFormObj] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await privateGET(`/registry/\${id}`);
      const formObj = {
        name: { 
          label: 'Registry Name', 
          type: 'text', 
          name: 'name', 
          value: response.name,
          required: true
        },
        description: { 
          label: 'Description', 
          type: 'textarea', 
          name: 'description', 
          value: response.description,
          rows: 3
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

  const deleteItem = async () => {
    try {
      await privateDELETE(`/registry/\${id}`);
      navigate(`/registry`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: '#dc2626' }}>Error loading registry: {error.message}</div>;
  }
  
  return (
    <EditPage route="registry" id={id} formObj={formObj} deleteFunction={deleteItem} />
  );
}
