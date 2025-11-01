function Projects({ projects }) {
    return (
        <div>
            {projects.map((project) => (
                <div key={project.id}>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    );
}

export default Projects;