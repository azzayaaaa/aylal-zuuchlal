# Sakura Travel

Full-stack travel booking platform for Mongolian customers planning Japan trips.

Live demo: https://sakura-travel.vercel.app

## What This Project Shows

Sakura Travel is built as a portfolio-ready product demo, not just a landing page. It combines a cinematic marketing site with a working booking workflow, AI itinerary assistant, transactional email flow, and an admin operations dashboard.

Core user flow:

1. Customer understands the Tokyo-Fuji / Disney / Shopping travel packages.
2. Customer asks the AI assistant for itinerary advice in Mongolian.
3. Customer completes the smart booking wizard.
4. Booking is saved to the database and prepared for email confirmation.
5. Admin reviews, filters, and updates booking/payment status.

## Key Features

- AI itinerary assistant for budget, days, traveler type, Fuji, Disney, shopping, and anime interests.
- Smart booking wizard with traveler count, date, group type, interests, payment preference, and generated trip profile.
- Gmail/Nodemailer-ready booking confirmation email workflow.
- Auth-protected admin dashboard with search, filters, metrics, revenue estimate, detail views, and status/payment updates.
- Cinematic GSAP ScrollTrigger route experience.
- Mobile-first responsive layout for homepage, login, booking, and gallery sections.
- Prisma + MySQL database with indexes for booking lookup and reminders.
- Vercel production deployment.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- MySQL
- Vercel
- GSAP ScrollTrigger
- Vercel AI SDK + Groq
- Nodemailer

## Local Development

```bash
npm install
npm run db:generate
npm run dev
```

Open http://localhost:3000.

Required environment variables are stored locally in `.env` and configured on Vercel for production.

## Microservice Mode

The project also includes lightweight service files for a gateway-style architecture.

```bash
npm run dev:services
npm run dev
```

Service map:

| Service | Port | Responsibility |
| --- | ---: | --- |
| API Gateway | 5000 | Routes booking requests |
| Auth Service | 5001 | Login/register/JWT |
| User Service | 5002 | Profile |
| Tour Service | 5003 | Tour packages |
| Booking Service | 5004 | Bookings |
| Payment Service | 5005 | Payment/status |
| Notification Service | 5007 | Email/SMS |

The frontend calls `/api/gateway/bookings`. If local services are not running, the route falls back to the Next.js booking handler so the UI remains testable.

## Interview Talking Points

- I designed the user journey from travel discovery to admin follow-up.
- I optimized the AI assistant with local fast replies before calling the LLM, improving perceived speed and Mongolian response quality.
- I built the booking flow so user interests become structured context for the manager.
- I added admin tooling that reflects real operational needs: filtering, status updates, payment state, and revenue estimates.
- I shipped the app to Vercel and verified build, lint, mobile overflow, and production readiness.

## Useful Routes

- `/` - marketing site and cinematic journey
- `/booking` - smart booking wizard
- `/login` - customer login
- `/my-bookings` - customer bookings
- `/admin` - admin operations dashboard
- `/case-study` - engineering case study
