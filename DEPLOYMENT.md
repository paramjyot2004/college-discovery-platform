Deployment options

1) Render (easy, free tier for hobby projects)
- Push repo to GitHub
- Create a new Web Service on Render and connect the repo
- Build command: `npm run build`
- Start command: `node dist/server.cjs`
- Set `NODE_ENV=production` in Render Env (optional). Render provides `PORT` automatically.

2) Docker (portable)
- Build locally:

```bash
docker build -t college-discovery .
```

- Run:

```bash
docker run -p 3000:3000 -e NODE_ENV=production college-discovery
```

- Push the image to your registry and deploy to DigitalOcean App Platform, Fly.io, or a VPS.
	- Push the image to your registry and deploy to DigitalOcean App Platform, Fly.io, or a VPS.

CI / Automatic deploy options

- GitHub Actions + GHCR (recommended): Add the `.github/workflows/docker-publish.yml` workflow included in this repo. On push to `main` it will build and publish a Docker image to `ghcr.io/<your-org>/college-discovery` using the `GITHUB_TOKEN`.

- Render automatic deploy: Use `.github/workflows/render-deploy.yml` which will call the Render API to trigger a deploy after pushes to `main`. Add `RENDER_API_KEY` and `RENDER_SERVICE_ID` as repository secrets in GitHub.

Render manifest

This repository includes a `render.yaml` manifest you can import into Render when creating a new service. Fill in the repository field if you want the manifest to reference the correct repo.

3) VPS / Manual (DigitalOcean droplet, EC2)
- SSH to server, install Node 20 and Docker or use PM2
- Clone repo, run `npm ci`, `npm run build`, then `node dist/server.cjs` (behind a reverse proxy like nginx)

Notes
- Data persistence: `server/db.json` is local; migrate to Postgres for production (Prisma already scaffolded under `/prisma`).
- The server reads `PORT` from the environment now; hosting platforms will set it automatically.
