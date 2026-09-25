# Wasco Energy Helm Chart

This chart deploys the Wasco Energy frontend, backend, and an optional MongoDB instance.

## Install

```powershell
helm upgrade --install wasco-energy .\helm\wasco-energy `
  --namespace wasco-energy `
  --create-namespace `
  --set ingress.host=wasco.example.com `
  --set backend.secret.jwtSecret="replace-with-a-long-random-secret"
```

The chart routes:

```text
/        -> frontend:3000
/api     -> backend:4014
/uploads -> backend:4014
```

The frontend image should be built with:

```powershell
docker build `
  --build-arg NEXT_PUBLIC_API_URL=/api `
  -t registry.gitlab.com/brillar/atenxion-bank/wasco-energy-frontend:1.0.0 `
  .\frontend
```

The backend image should be tagged as:

```powershell
registry.gitlab.com/brillar/atenxion-bank/wasco-energy-backend:1.0.0
```

## Private GitLab Registry

If your registry is private, create an image pull secret:

```powershell
kubectl create secret docker-registry gitlab-registry `
  --namespace wasco-energy `
  --docker-server=registry.gitlab.com `
  --docker-username=<gitlab-username> `
  --docker-password=<gitlab-token> `
  --docker-email=<email>
```

Then install with:

```powershell
helm upgrade --install wasco-energy .\helm\wasco-energy `
  --namespace wasco-energy `
  --create-namespace `
  --set imagePullSecrets[0].name=gitlab-registry
```

## External MongoDB

To use MongoDB Atlas or another external MongoDB:

```powershell
helm upgrade --install wasco-energy .\helm\wasco-energy `
  --namespace wasco-energy `
  --set mongodb.enabled=false `
  --set externalMongodb.uri="mongodb+srv://user:password@cluster/dbname"
```

## OpenShift

The chart includes `openshift.yaml`, which disables Kubernetes Ingress, enables OpenShift Routes, uses existing Secrets, and disables the bundled `mongo:latest` deployment.

Create the project and required secrets:

```powershell
oc new-project wasco-energy

oc create secret docker-registry gitlab-registry `
  --docker-server=registry.gitlab.com `
  --docker-username=<gitlab-username> `
  --docker-password=<gitlab-token> `
  --docker-email=<email>

oc create secret generic wasco-energy-backend-secrets `
  --from-literal=JWT_SECRET="replace-with-a-long-random-secret"

oc create secret generic wasco-energy-mongodb `
  --from-literal=MONGODB_URI="mongodb://user:password@mongodb-host:27017/wasco-vendor-portal"
```

Edit `openshift.yaml` and set `route.host` to a hostname under your OpenShift apps domain, then install:

```powershell
helm upgrade --install wasco-energy .\helm\wasco-energy `
  --namespace wasco-energy `
  -f .\helm\wasco-energy\openshift.yaml
```

`values-openshift.yaml` is kept as a compatibility alias, but `openshift.yaml` is the preferred override. The frontend and backend images should be rebuilt after Dockerfile changes so they work better with OpenShift restricted SCC arbitrary UIDs.
