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
  highlights: string[];
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
  role: "Software Engineering Intern | Computer Science Student | Full-Stack Development",
  headline:
    "Computer Science student focused on full-stack development, backend systems, and data-driven web applications.",
  location: "Hamilton, NZ",
  email: "fernandohimendra@gmail.com",
  summary:
    "Computer Science student at the University of Waikato with an A+ average and hands-on full-stack development experience building React, Next.js, TypeScript, Python, Java, Prisma, and PostgreSQL applications.",
  resumeUrl: "",
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
    skills: ["Prisma", "PostgreSQL", "Neon", "API Routes", "CRUD Workflows", "Zod"],
  },
  {
    category: "Testing and Tools",
    skills: ["Git", "Vitest", "Vercel", "Unit Testing", "Data Visualization", "Recharts"],
  },
  {
    category: "Computer Science",
    skills: ["Data Structures and Algorithms", "Object-Oriented Programming", "Software Engineering Principles"],
  },
];

export const projects: Project[] = [
  {
    title: "Personal Analytics Dashboard",
    slug: "personal-analytics-dashboard",
    description:
      "A personal analytics dashboard for tracking entries, reviewing trends, and presenting personal data clearly.",
    longDescription:
      "Built as a practical dashboard project to demonstrate data visualization, structured tracking workflows, and clean information display across study, finance, health, and personal entries.",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Clerk",
      "Prisma",
      "PostgreSQL",
      "Neon",
      "Zod",
      "Recharts",
      "Vitest",
      "Vercel",
    ],
    githubUrl: "https://github.com/HimendraFdo/personal-analytics-dashboard",
    liveUrl: undefined,
    highlights: [
      "Implemented validated CRUD workflows using TypeScript, Zod, and Prisma to support reliable data entry and database-backed records.",
      "Created filtered history views, summary cards, and Recharts visualizations to help users review activity patterns and personal metrics.",
      "Developed reusable React components with Tailwind CSS and added Vitest coverage for key utility and validation logic.",
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
    href: "https://www.linkedin.com/in/himendra-fernando-aa2aa5313/",
  },
  resume: {
    label: "Resume",
    href: "",
  },
};
