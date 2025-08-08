# DevOps With The Prisma

### Run PostgreSQL on Docker
```bash
docker run -d \                                                                                                                                     ─╯
  --name postgres-db \
  --network my-network \
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
### Start the Docker containers:
```bash
docker compose up -d
```

### Run database migrations:
After the containers are up, we need to apply Prisma migrations to create the necessary tables in the database.

```bash
docker compose exec app npx prisma migrate dev --name init
```



### Access the app:
Open your browser at *http://localhost:3000*


### Automating Migrations (Optional)

If you want to automate running migrations when using Docker Compose, you can add a dedicated migration service to your *docker-compose.yaml* like this:

```bash
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - postgres-db
    environment:
      DATABASE_URL: postgresql://admin:secret@postgres-db:5432/postgres
    networks:
      - my-network

  postgres-db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: postgres
    ports:
      - "5432:5432"
    networks:
      - my-network
    volumes:
      - postgres_data:/var/lib/postgresql/data

  migrate:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      - postgres-db
    environment:
      DATABASE_URL: postgresql://admin:secret@postgres-db:5432/postgres
    networks:
      - my-network
    command: npx prisma migrate deploy

volumes:
  postgres_data:
    driver: local

networks:
  my-network:
    driver: bridge

```

### Start app and database:
```bash
docker compose up -d app postgres-db
```

### Run migrations once (or after schema changes):

```bash
docker compose run migrate
```
### Access the app:
Open your browser at *http://localhost:3000*
