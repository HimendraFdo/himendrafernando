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
  name: "YOUR_NAME",
  role: "Software Engineering Portfolio",
  headline: "Aspiring software engineer focused on building practical, data-informed web applications.",
  location: "YOUR_LOCATION",
  email: "YOUR_EMAIL",
  summary:
    "I build clean, maintainable web applications with a focus on useful interfaces, structured data, and thoughtful problem solving. This portfolio highlights selected projects, technical skills, and learning milestones.",
  resumeUrl: "YOUR_RESUME_URL",
};

export const about: About = {
  intro:
    "I am a software engineering student/developer building a portfolio around practical front-end development, data visualization, and full-stack project work. I enjoy turning ambiguous ideas into structured products that are easy to understand and extend.",
  focus: [
    "Building responsive web applications with modern JavaScript and TypeScript.",
    "Creating dashboards and interfaces that make information easier to explore.",
    "Writing clear, reusable code that future collaborators can work with confidently.",
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
    skills: ["TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    category: "Frontend",
    skills: ["React", "Vite", "Tailwind CSS", "Responsive UI Development"],
  },
  {
    category: "Data and Visualization",
    skills: ["Dashboard Design", "Data Visualization", "Analytics Workflows"],
  },
  {
    category: "Tools and Workflow",
    skills: ["Git", "GitHub", "npm", "Code Review"],
  },
];

export const projects: Project[] = [
  {
    title: "Personal Analytics Dashboard",
    slug: "personal-analytics-dashboard",
    description:
      "A personal analytics dashboard that showcases data visualization, tracking, and dashboard-building skills.",
    longDescription:
      "Personal Analytics Dashboard is a portfolio project designed to demonstrate how personal data can be organized, tracked, and presented through clear dashboard views. The project is intended to highlight front-end implementation, structured data handling, and practical data visualization patterns without claiming production use or external users.",
    techStack: ["TypeScript", "React", "Vite", "Tailwind CSS"],
    githubUrl: "YOUR_GITHUB_URL/personal-analytics-dashboard",
    liveUrl: undefined,
    image: "/projects/personal-analytics-dashboard.png",
    highlights: [
      "Designed to present tracked personal metrics in a clean dashboard format.",
      "Demonstrates dashboard-building, component planning, and data display skills.",
      "Structured as a featured portfolio project that can be expanded with real data sources later.",
    ],
    featured: true,
  },
];

export const education: EducationItem[] = [
  {
    institution: "YOUR_UNIVERSITY",
    degree: "YOUR_DEGREE",
    location: "YOUR_UNIVERSITY_LOCATION",
    startDate: "YOUR_START_DATE",
    endDate: "YOUR_END_DATE",
    summary:
      "Add a concise summary of your programme, relevant coursework, or academic focus here. Avoid adding grades, awards, or specific achievements until they are confirmed.",
  },
];

export const contact: Contact = {
  email: "YOUR_EMAIL",
  github: {
    label: "GitHub",
    href: "YOUR_GITHUB_URL",
  },
  linkedin: {
    label: "LinkedIn",
    href: "YOUR_LINKEDIN_URL",
  },
  resume: {
    label: "Resume",
    href: "YOUR_RESUME_URL",
  },
};
