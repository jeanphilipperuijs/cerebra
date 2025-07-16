# Cerebra — Elastic Cluster Manager Clone in React

Cerebra is a React-based UI for managing Elasticsearch clusters, inspired by Cerebro.  
It provides cluster health overview, shard viewer, node stats, and shard relocation.

---

## Features

- Cluster health and overview dashboard  
- Shard viewer with relocation support  
- Node resource usage monitoring (CPU, memory, disk)  
- Dark mode support  
- Configurable Elasticsearch backend URL via runtime config  
- Easy deployment with Docker and Kubernetes

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn  
- Docker (for container builds)  
- Kubernetes cluster (optional)

### Installation

```bash
git clone https://github.com/yourusername/cerebra.git
cd cerebra
npm install
````

### Running in Development

A default `public/config.json` with dev Elasticsearch URL is included.

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Configuration

Cerebra reads backend config from `/config.json` at runtime.

### Development

`public/config.json` contains default config, e.g.:

```json
{
  "ELASTIC_BASE_URL": "http://localhost:9200"
}
```

### Production / Kubernetes

Override the config by mounting a ConfigMap as `/config.json` in the container.

Example Kubernetes ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: elasticsearch-config
data:
  config.json: |
    {
      "ELASTIC_BASE_URL": "http://es.elasticsearch.svc.cluster.local"
    }
```

Mount it in your Pod spec:

```yaml
volumes:
  - name: config-volume
    configMap:
      name: elasticsearch-config
containers:
  - name: cerebra-frontend
    image: your-image
    volumeMounts:
      - name: config-volume
        mountPath: /usr/share/nginx/html/config.json
        subPath: config.json
        readOnly: true
```

---

## Building for Production

```bash
npm run build
```

This outputs static files in `dist/`, ready for deployment.

---

## Docker

### Build the Docker image

```bash
docker build -t cerebra-frontend .
```

### Run the container locally

```bash
docker run -p 8080:80 cerebra-frontend
```

---

## Notes on Runtime Config

* The app fetches `/config.json` on load to get `ELASTIC_BASE_URL`.
* This allows changing backend URLs without rebuilding the app.
* Ensure `config.json` is served alongside your static files.

---

## Contributing

Feel free to open issues or submit pull requests.

---

## License

MIT License © Your Name

---

## Acknowledgments

Inspired by [Cerebro](https://github.com/lmenezes/cerebro).

Container images available on [docker.io](https://hub.docker.com/r/jpruijs/cerebra)