# DevOps With The Prisma

### Run PostgreSQL on Docker
```bash
docker run -d \                                                                                                                                     ─╯
  --name postgres-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15
```
### PostgreSQL URL

1. If the backend run on local Machine and PostgreSQL run on Docker Container
```bash
DATABASE_URL="postgresql://admin:secret@localhost:5432/postgres?schema=public"
```
2. If both run on Docker Container
```bash
DATABASE_URL="postgresql://admin:secret@postgres-db:5432/postgres?schema=public"
```
