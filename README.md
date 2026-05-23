# Himendra Fernando Portfolio

Portfolio website front-end built with Vite, React, TypeScript, and Tailwind CSS, with an ASP.NET Core backend in `api/`.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- lucide-react

## Local Setup

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run backend checks:

```bash
dotnet restore Himendra.Portfolio.sln
dotnet build Himendra.Portfolio.sln
dotnet test Himendra.Portfolio.sln
```

## Portfolio Content

Portfolio text, project links, and contact placeholders are managed in `src/data/portfolio.ts`.
Add a real resume URL before enabling the resume link.
