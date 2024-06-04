# Red cross evidence 

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Prerequisites
1. Node.js
2. Yarn
3. Docker

## Getting Started
Copy the `.env.example` file to `.env` and fill in the necessary values.

```bash
cp .env.example .env
```

Run docker-compose to start the database. It will use all the data provided in the `.env` file.

```bash
docker-compose up -d
```

Install the dependencies

```bash
yarn install
```

### Prepare PrismaORM 

#### Prisma generate:
```bash
yarn postinstall
```
#### Run the migration files to create the tables:
```bash
yarn db:migrate:dev
```
#### Seed initial data into database:
```bash
yarn db:seed
```

### Start the development server

```bash
yarn dev
```

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
