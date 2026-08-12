# FRAME/GOA — Hacker House Goa 2026 Builder ID

A mobile-first Builder ID generator built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Canvas/SVG and optional Cloudinary share hosting.

## Requirements

- Node.js 20.9+ (Node 24 is supported)
- npm
- Optional Cloudinary account for hosted `/share/[id]` links and OG previews

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Cloudinary share setup

Set these variables in `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The core card generator works without Cloudinary. If Cloudinary is unavailable, Share to X falls back to an X intent with a pre-filled caption and the user can attach the downloaded PNG manually.

## Production

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Add the four environment variables in Vercel.
4. Deploy.
5. Test the generated card, download, X share, and `/share/[id]` OG preview on a phone.

## Tests

```bash
npm test
npm run lint
npm run build
```

## Privacy

Photo processing and PNG generation happen in the browser. The original photo is not uploaded by the core flow. The generated PNG is uploaded to Cloudinary only when the user chooses Share to X and Cloudinary hosting is configured.
