// Container inventory transcribed from the supplied Proxmox screenshot.
// This is a snapshot, not a live health or availability monitor.
export const containerGroups = [
  { title: 'Local AI & notebooks', containers: [
    { id: 114, name: 'Ollama' },
    { id: 113, name: 'Open WebUI' },
    { id: 104, name: 'Jupyter Notebook' },
  ] },
  { title: 'Data services', containers: [
    { id: 101, name: 'PostgreSQL' },
    { id: 105, name: 'ClickHouse' },
    { id: 106, name: 'MongoDB' },
    { id: 107, name: 'Redis' },
    { id: 111, name: 'Neo4j' },
  ] },
  { title: 'Development & automation', containers: [
    { id: 100, name: 'cloudflared' },
    { id: 102, name: 'Gitea' },
    { id: 103, name: 'Jenkins' },
    { id: 112, name: 'Apache Airflow' },
  ] },
  { title: 'Monitoring', containers: [
    { id: 108, name: 'Prometheus' },
    { id: 109, name: 'Grafana' },
    { id: 110, name: 'Uptime Kuma' },
  ] },
];
