import { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import EditPage from '../../../components/EditPage';
import { privateGET, privateDELETE } from '../../../services/httpService';

export default function EditProject() {
    const { id } = useParams();
    const [formObj, setFormObj] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await privateGET(`/projects/${id}`);
            const formObj = {
                name: { label: 'Project Name', type: 'text', name: 'name', value: response.name },
                description: { label: 'Project Description', type: 'text', name: 'description', value: response.description },
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

    const deleteProject = async () => {
        try {
            await privateDELETE(`/projects/${id}`);
            navigate(`/projects`);
        } catch (error) {
            console.error(error);
            throw error; // Re-throw so EditPage can handle it
        }
    };

    if (isLoading) {
        return <div style={{ padding: 20 }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ padding: 20, color: '#dc2626' }}>Error loading project: {error.message}</div>;
    }

    return (
        <EditPage route="projects" id={id} formObj={formObj} deleteFunction={deleteProject} />
    );
}

