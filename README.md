This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Microservices

This project also has a lightweight microservice mode. Start the services in
one terminal:

```bash
npm run dev:services
```

Then start the Next.js frontend in another terminal:

```bash
npm run dev
```

Service map:

| Service | Port | Responsibility |
| --- | ---: | --- |
| API Gateway | 5000 | routes all requests |
| Auth Service | 5001 | login/register/JWT |
| User Service | 5002 | profile |
| Tour Service | 5003 | tour packages |
| Booking Service | 5004 | bookings |
| Payment Service | 5005 | payment/status |
| Notification Service | 5007 | email/sms |

The frontend booking form calls `/api/gateway/bookings`; that route forwards to
`API_GATEWAY_URL` (`http://localhost:5000` by default). If the services are not
running during local design work, it falls back to the existing Next.js booking
handler so the UI still works.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
