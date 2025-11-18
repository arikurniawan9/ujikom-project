# Database Setup

## Local Development

To set up the database locally:

1. Make sure you have PostgreSQL installed and running
2. Update your `.env` file with the correct `DATABASE_URL`
3. Run the following commands:

```bash
npx prisma migrate dev
```

This will create the database schema based on the Prisma schema.

## For Production Deployment

When deploying to Vercel, make sure to:

1. Set the `DATABASE_URL` environment variable in your Vercel project settings
2. Run the following command to apply migrations:

```bash
npx prisma migrate deploy
```

## Generate Prisma Client

To regenerate the Prisma client after schema changes:

```bash
npx prisma generate
```