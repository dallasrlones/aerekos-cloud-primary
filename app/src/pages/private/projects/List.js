import React, { useEffect, useState } from 'react';
import { privateGET } from '../../../services/httpService';
import ListItems from '../../../components/ListItems';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await privateGET('/projects');
      setProjects(res);
    })();
  }, []);

  return (
    <div>
        <ListItems items={projects} route="projects">
        {(item) => <span style={{ fontWeight: 'bold', marginLeft: 15 }}>{item.name}</span>}
      </ListItems>
      <Link to="/projects/create" style={{ marginTop: 20, display: 'block' }}>Create Project</Link>
    </div>
  );
}