import analyticsImage from "../assets/Analytics.png";
import dashboardImage from "../assets/Dashboard.png";
import entriesImage from "../assets/Entries.png";

export type Profile = {
  name: string;
  role: string;
  headline: string;
  location: string;
  email: string;
  summary: string;
  resumeUrl: string;
};

export type About = {
  intro: string;
  focus: string[];
  values: string[];
};

export type SkillGroup = {
  category: string;
  skills: string[];
};

export type Project = {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  image?: string;
  images?: {
    src: string;
    alt: string;
  }[];
  highlights: string[];
  engineeringDetails?: {
    title: string;
    description: string;
  }[];
  featured: boolean;
};

export type EducationItem = {
  institution: string;
  degree: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  summary: string;
};

export type ContactLink = {
  label: string;
  href: string;
};

export type Contact = {
  email: string;
  github: ContactLink;
  linkedin: ContactLink;
  resume: ContactLink;
};

export const profile: Profile = {
  name: "Himendra Fernando",
  role: "Computer Science Student | Full-Stack Development",
  headline:
    "Computer Science student focused on full-stack development, backend systems, and data-driven web applications.",
  location: "Hamilton, NZ",
  email: "fernandohimendra@gmail.com",
  summary:
    "Computer Science student at the University of Waikato with an A+ average and hands-on full-stack development experience building React, Next.js, TypeScript, Python, Java, Prisma, and PostgreSQL applications.",
  resumeUrl: "/Himendra Fernando CV.pdf",
};

export const about: About = {
  intro:
    "I am a Computer Science student at the University of Waikato building practical full-stack applications with React, Next.js, TypeScript, Python, Java, Prisma, and PostgreSQL. I am interested in software engineering internships focused on full-stack development, backend systems, and data-driven web applications.",
  focus: [
    "Building authenticated full-stack web applications with reusable React components.",
    "Creating validated API routes, CRUD workflows, and database-backed records.",
    "Designing dashboards, charts, and filtered views that make personal data easier to review.",
  ],
  values: [
    "Clarity in both user experience and code structure.",
    "Practical engineering choices over unnecessary complexity.",
    "Continuous learning through hands-on projects.",
  ],
};

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["Python", "Java", "TypeScript", "JavaScript", "HTML", "CSS", "SQL"],
  },
  {
    category: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "Responsive Design", "Reusable Components"],
  },
  {
    category: "Backend and Data",
    skills: ["Prisma", "PostgreSQL", "Neon", "REST APIs", "CRUD Workflows", "Zod", "Row Level Security"],
  },
  {
    category: "Testing and Tools",
    skills: ["Git", "Vitest", "GitHub Actions", "Vercel", "Upstash Redis", "Data Visualization", "Recharts"],
  },
  {
    category: "Computer Science",
    skills: ["Data Structures and Algorithms", "Object-Oriented Programming", "Software Engineering Principles"],
  },
  {
    category: "Transferable Skills",
    skills: ["Communication", "Problem-Solving", "Collaboration", "Adaptability", "Time Management"],
  },
];

export const projects: Project[] = [
  {
    title: "Personal Analytics Dashboard",
    slug: "personal-analytics-dashboard",
    description:
      "An authenticated, mobile-responsive personal analytics dashboard for logging time, spending, and nutrition data.",
    longDescription:
      "Migrated from a React and Vite frontend with browser-only storage into a production-style Next.js application backed by PostgreSQL. The result combines owner-scoped data, typed REST APIs, responsive analytics, and defence-in-depth security.",
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Clerk",
      "Prisma",
      "PostgreSQL",
      "Neon",
      "Zod",
      "Upstash Redis",
      "Open Food Facts",
      "Recharts",
      "Vitest",
      "GitHub Actions",
      "Vercel",
    ],
    githubUrl: "https://github.com/HimendraFdo/personal-analytics-dashboard",
    liveUrl: "https://personalanalyticsdashboard.vercel.app",
    image: dashboardImage,
    images: [
      {
        src: dashboardImage,
        alt: "Time tracking dashboard overview",
      },
      {
        src: entriesImage,
        alt: "Money tracking entries workspace",
      },
      {
        src: analyticsImage,
        alt: "Nutrition analytics workspace",
      },
    ],
    highlights: [
      "Built configuration-driven time, money, and nutrition workspaces with filtered records, summary cards, responsive Recharts visualisations, and Open Food Facts-powered macro tracking.",
      "Designed multi-tenant isolation with Clerk authentication, API ownership filters, PostgreSQL row level security, transaction-local user context, and least-privilege database roles.",
      "Automated production checks with Vitest regression coverage, opt-in PostgreSQL RLS integration tests, GitHub Actions CI, and migration-aware Vercel deployments backed by Neon.",
    ],
    engineeringDetails: [
      {
        title: "Layered architecture",
        description:
          "Separated reusable UI, shared state, validated route handlers, Prisma data access, and durable PostgreSQL persistence.",
      },
      {
        title: "Defence in depth",
        description:
          "Enforced owner checks in the API and RLS policies in PostgreSQL so user records remain isolated at two layers.",
      },
      {
        title: "Hardened APIs",
        description:
          "Added Zod validation, same-origin mutation checks, JSON body limits, security headers, and route-specific rate limits.",
      },
      {
        title: "Production delivery",
        description:
          "Used Upstash Redis counters, Neon runtime and migration URLs, regression tests, CI checks, and Vercel deployment builds.",
      },
    ],
    featured: true,
  },
];

export const education: EducationItem[] = [
  {
    institution: "The University of Waikato",
    degree: "Bachelor of Science in Computer Science",
    location: "Hamilton, NZ",
    startDate: "In progress",
    endDate: "",
    summary:
      "Current A+ average. Relevant coursework: Software Engineering, Artificial Intelligence, Data Structures and Algorithms, Programming in Java, and Programming in Python.",
  },
];

export const contact: Contact = {
  email: "fernandohimendra@gmail.com",
  github: {
    label: "GitHub",
    href: "https://github.com/HimendraFdo",
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/himendra-fernando/",
  },
  resume: {
    label: "Resume",
    href: "/Himendra Fernando CV.pdf",
  },
};
