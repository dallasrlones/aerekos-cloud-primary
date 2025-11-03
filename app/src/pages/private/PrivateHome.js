import Devices from './devices/List.js';
import Projects from './projects/List.js';
import AerekosServices from './aerekos_services/List.js';
import ApiKeys from './api_keys/List.js';

export default function PrivateHome() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <hr />
      <div>
        <h3>API Keys</h3>
        <ApiKeys />
      </div>
      <hr />
      <div>
        <h3>Devices</h3>
        <Devices />
      </div>
      
      <hr />
      <div>
        <h3>Projects</h3>
        <Projects />
      </div>

      <hr />
      <div>
        <h3>Aerekos Services</h3>
        <AerekosServices />
      </div>
    </div>
  );
}
