export type ProjectCategory = "platform" | "automation" | "ai";

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  kind: string;
  tagline: string;
  stack: string[];
  summary: string;
  problem: string;
  architecture: string[];
  highlights: string[];
  outcomes: string[];
  metrics: Array<{ label: string; value: string }>;
};

export const profile = {
  /** Preferred / everyday name */
  name: "Abhinav",
  /** Alternate given name — both appear in branding site-wide */
  alternateName: "Shailendra",
  role: "DevOps & Platform Engineer",
  company: "Raptorvoid Private Limited",
  email: "rajputtabhinav@outlook.com",
  phone: "+91 8299072802",
  city: "Kanpur, Uttar Pradesh, India",
  dob: "30/09/2004",
  degree: "Bachelor from Kanpur University",
};

/** Header, titles, footer — both names */
export const brandingName = `${profile.name} / ${profile.alternateName}`;

export const startup = {
  name: "Raptorvoid Private Limited",
  product: "Amatic.ai",
  website: "https://amatic.ai",
  role: "CEO & Founder",
  tagline: "Building an AI education platform where students learn by asking, drawing, speaking, and creating.",
  summary:
    "At Raptorvoid Private Limited, I am building Amatic.ai as an AI-powered learning workspace for students and teachers. The goal is to make self-study more interactive through smart notes, subject-aware AI chat, visual explanations, voice narration, canvas-based learning, and productivity tools that help students stay organized.",
  focus: [
    "AI-assisted self-study with smart notes, explanations, and content tools",
    "Canvas-based learning where students can draw, write, and get visual teaching help",
    "Voice-enabled AI support with speech-to-text and natural text-to-speech narration",
    "Teacher workflows for explaining concepts visually and teaching smarter",
    "Local-first, collaborative whiteboard foundations with shareable learning sessions",
  ],
};

export const focusAreas = [
  {
    title: "Containerized Delivery",
    description:
      "Docker images, Compose stacks, registry workflows, multi-service topology, health probes, persistent volumes, and environment-driven configs that mirror prod.",
  },
  {
    title: "Cloud & Infrastructure as Code",
    description:
      "AWS primitives (VPC, IAM, EC2/EKS-ready shapes, RDS, S3), Terraform modules for repeatable environments, and safe network and access patterns.",
  },
  {
    title: "CI/CD & GitOps-ready releases",
    description:
      "GitHub Actions pipelines, scripted deploy gates, rollout checks alongside containers, secrets outside images, and roll-forward-friendly delivery.",
  },
  {
    title: "Kubernetes & orchestration fundamentals",
    description:
      "Workload manifests (Deployments/Services/Ingress expectations), Helm-style packaging awareness, readiness/liveness probes, and cluster-friendly service boundaries.",
  },
  {
    title: "Observability & control planes",
    description:
      "Dashboards, status streams, audit trails, alert rules, schedules, and APIs that expose how the platform is behaving under load.",
  },
  {
    title: "Queues, workers & platform automation",
    description:
      "BullMQ, Celery, and similar queue topologies—retries, beat schedules, backpressure-aware workers, plus automation that keeps runtime state honest.",
  },
];

export const skills = [
  { label: "Docker, containers & Docker Compose", value: 96 },
  { label: "AWS (VPC, IAM, EC2–class compute, RDS, S3, CloudWatch)", value: 86 },
  { label: "Terraform / IaC (modules, state, repeatable envs)", value: 84 },
  { label: "Kubernetes basics (Deployments, Services, Ingress, Helm)", value: 80 },
  { label: "CI/CD — GitHub Actions, gated deploy scripts", value: 85 },
  { label: "Linux, shell automation & systemd-style operations", value: 91 },
  { label: "Nginx ingress, TLS & reverse-proxy topologies", value: 87 },
  { label: "PostgreSQL, Redis & queue-backed pipelines", value: 89 },
  { label: "Observability — metrics, logs, probes, alerting", value: 91 },
  { label: "FastAPI, Node.js & Next.js at the edge of the platform", value: 86 },
];

export const projects: Project[] = [
  {
    slug: "prometheus",
    name: "Prometheus",
    category: "platform",
    kind: "Monitoring control plane",
    tagline: "Monitoring, orchestration, schedules, alerts, and live fleet visibility.",
    stack: [
      "FastAPI",
      "React",
      "PostgreSQL",
      "Redis",
      "Celery",
      "WebSockets",
      "Docker Compose",
      "Terraform",
      "AWS",
      "GitHub Actions",
      "Kubernetes",
    ],
    summary:
      "A unified server operating platform focused on safe task execution, runtime visibility, agent heartbeats, alert rules, recurring schedules, and audit-friendly operational workflows.",
    problem:
      "Operations teams need a single place to understand machine health, run safe tasks, watch agent heartbeats, and inspect what changed without jumping between scripts and terminals.",
    architecture: ["FastAPI API", "PostgreSQL state", "Redis broker", "Celery workers", "WebSocket updates", "Docker Compose"],
    highlights: [
      "FastAPI controller with durable runtime state",
      "Agent registration, heartbeat, and metrics ingestion",
      "Celery worker and beat scheduler topology",
    ],
    outcomes: [
      "Separated API, worker, scheduler, database, and cache responsibilities.",
      "Designed status surfaces around health, auditability, and recurring automation.",
      "Made the system easier to run locally with service dependencies and persistent volumes.",
    ],
    metrics: [
      { label: "Runtime shape", value: "5 services" },
      { label: "Ops focus", value: "alerts + schedules" },
      { label: "Delivery", value: "Compose first" },
    ],
  },
  {
    slug: "serverqc-pro",
    name: "ServerQC Pro",
    category: "automation",
    kind: "Hardware validation automation",
    tagline: "Automated hardware validation, stress testing, thermal checks, and benchmark exports.",
    stack: [
      "Go",
      "Linux",
      "Docker",
      "Benchmark tooling",
      "Prometheus metrics",
      "GitHub Actions",
      "CI/CD",
      "Terraform",
      "AWS",
    ],
    summary:
      "A server validation and benchmarking suite designed for hardware quality workflows, concurrent test execution, automated tool installation, and operational reporting.",
    problem:
      "Manual server quality checks are slow, inconsistent, and hard to compare across machines when teams need repeatable evidence before deployment or handoff.",
    architecture: ["Go CLI/API", "Linux probes", "Stress tools", "Thermal checks", "Report exporters", "Prometheus metrics"],
    highlights: [
      "Concurrent worker-style test execution",
      "Thermal monitoring and hardware validation focus",
      "Multi-format report export including Prometheus metrics",
    ],
    outcomes: [
      "Modeled hardware checks as repeatable jobs instead of one-off manual commands.",
      "Focused reporting on benchmarks, thermal behavior, and operational readiness.",
      "Kept the system Linux-friendly for realistic server validation workflows.",
    ],
    metrics: [
      { label: "Execution", value: "parallel tests" },
      { label: "Reporting", value: "multi-format" },
      { label: "Target", value: "Linux servers" },
    ],
  },
  {
    slug: "abhi-2",
    name: "Abhi2.0",
    category: "ai",
    kind: "Queue-backed AI operations",
    tagline: "AI-powered Gmail operations stack with BullMQ, Redis, PostgreSQL, and Socket.io.",
    stack: [
      "Express",
      "Next.js",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Socket.io",
      "Docker Compose",
      "Terraform",
      "AWS",
      "GitHub Actions",
      "Kubernetes",
    ],
    summary:
      "A local-first AI-powered client management system using a monorepo structure and a separate worker path for background processing and event-driven workflows.",
    problem:
      "AI-assisted client workflows need background processing, realtime visibility, and durable state so long-running actions do not block the product experience.",
    architecture: ["Next.js app", "Express API", "PostgreSQL", "Redis", "BullMQ worker", "Socket.io events"],
    highlights: [
      "Queue-backed worker design",
      "Docker Compose for database and cache services",
      "Workspace-based service separation",
    ],
    outcomes: [
      "Split user-facing app work from asynchronous worker execution.",
      "Used Redis queues to support retries and background processing.",
      "Designed realtime events for operational visibility while tasks run.",
    ],
    metrics: [
      { label: "Pattern", value: "API + worker" },
      { label: "Realtime", value: "Socket.io" },
      { label: "Storage", value: "Postgres + Redis" },
    ],
  },
  {
    slug: "latenite-ai",
    name: "Latenite.ai",
    category: "ai",
    kind: "AI system administration",
    tagline: "Containerized AI system administration product with Qdrant, Nginx, SSH, and health checks.",
    stack: [
      "Next.js",
      "Nginx",
      "Qdrant",
      "Docker Compose",
      "SSH",
      "WebSockets",
      "Terraform",
      "AWS",
      "Kubernetes",
      "GitHub Actions",
    ],
    summary:
      "An AI system administration product shaped around real command execution, documentation lookup, remote access, vector search, and a production-style container topology.",
    problem:
      "System administration products need more than a chat UI: they need controlled command execution, service health, searchable knowledge, and a runtime topology that can be operated.",
    architecture: ["Next.js UI", "Nginx proxy", "Qdrant vector DB", "SSH command path", "WebSocket status", "Compose health checks"],
    highlights: [
      "Qdrant vector database service",
      "Nginx reverse proxy layer",
      "Persistent volumes and health checks",
    ],
    outcomes: [
      "Designed a production-shaped local environment with proxy, app, and vector services.",
      "Paired AI lookup with practical command and remote-access workflows.",
      "Kept operational checks visible through health-oriented service configuration.",
    ],
    metrics: [
      { label: "Search", value: "Qdrant" },
      { label: "Ingress", value: "Nginx" },
      { label: "Ops", value: "SSH + health" },
    ],
  },
  {
    slug: "zero-ai",
    name: "Zero.AI",
    category: "ai",
    kind: "Realtime data product",
    tagline: "AI trading platform using PostgreSQL, Redis, Prisma, protected APIs, and realtime services.",
    stack: [
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "NextAuth",
      "WebSockets",
      "Vercel",
      "Terraform",
      "AWS",
      "GitHub Actions",
    ],
    summary:
      "A data-heavy AI product with server-side protected APIs, durable storage, cache layers, and realtime infrastructure concerns built into the product design.",
    problem:
      "Data-heavy AI products need protected APIs, durable records, cache layers, and realtime updates before the experience can feel reliable.",
    architecture: ["Next.js app", "Protected API routes", "Prisma ORM", "PostgreSQL", "Redis cache", "WebSocket updates"],
    highlights: [
      "Protected API architecture",
      "PostgreSQL plus Redis runtime pattern",
      "AI-driven workloads with production constraints",
    ],
    outcomes: [
      "Designed around authenticated server-side access instead of open client-only calls.",
      "Used relational data and cache layers for responsive product behavior.",
      "Accounted for realtime delivery as part of the core architecture.",
    ],
    metrics: [
      { label: "Access", value: "protected APIs" },
      { label: "Data", value: "Prisma" },
      { label: "Runtime", value: "realtime" },
    ],
  },
  {
    slug: "edustack",
    name: "EduStack",
    category: "platform",
    kind: "Bot-backed product platform",
    tagline: "Telegram mini app platform with MongoDB, backend APIs, bot flows, and Dockerized local services.",
    stack: [
      "Node.js",
      "Express",
      "MongoDB",
      "Telegram Bot",
      "React",
      "Docker Compose",
      "Terraform",
      "AWS",
      "GitHub Actions",
      "Kubernetes",
    ],
    summary:
      "A product stack spanning backend, bot runtime, manual payment verification flows, and local containerized Mongo services for development and operations.",
    problem:
      "Bot-backed education products need coordinated frontend, backend, bot commands, data storage, and operational rules around referrals, verification, and withdrawals.",
    architecture: ["React frontend", "Express API", "Telegram bot", "MongoDB", "mongo-express", "Docker Compose"],
    highlights: [
      "Backend, frontend, and bot split",
      "Dockerized MongoDB and mongo-express setup",
      "Operational business rules for referrals and withdrawals",
    ],
    outcomes: [
      "Separated user interface, API, and bot runtime concerns.",
      "Made local development easier with MongoDB and admin tooling in containers.",
      "Modeled business workflows around verification and operational review.",
    ],
    metrics: [
      { label: "Services", value: "frontend/API/bot" },
      { label: "Database", value: "MongoDB" },
      { label: "Ops", value: "verification flow" },
    ],
  },
  {
    slug: "amatic-ai",
    name: "Amatic.ai",
    category: "ai",
    kind: "AI education workspace",
    tagline: "AI learning canvas for self-study, smart notes, visual explanations, and teacher-led lessons.",
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "Anthropic Claude",
      "Google Gemini",
      "ElevenLabs",
      "Firebase (GCP)",
      "Express",
      "Docker",
      "Terraform",
      "AWS",
      "GitHub Actions",
    ],
    summary:
      "An education-focused AI product under Raptorvoid Private Limited where students can ask questions, draw concepts, receive visual explanations, hear voice narration, create smarter notes, and use AI productivity tools for self-study.",
    problem:
      "Students often study alone with disconnected tools: notes in one place, explanations somewhere else, diagrams on paper, and no teacher-like feedback loop. Teachers also need faster ways to explain complex topics visually and adapt lessons around what students are drawing, asking, or struggling with.",
    architecture: [
      "React/Vite app",
      "Interactive canvas",
      "Claude teaching brain",
      "Gemini visual workers",
      "ElevenLabs voice",
      "Firebase sharing",
      "Local-first storage",
      "Express API layer",
    ],
    highlights: [
      "Founder-led education product direction under Raptorvoid Private Limited",
      "Subject-aware AI chat for math, science, English, and general learning",
      "Canvas AI that recognizes drawings and turns them into visual teaching moments",
      "Voice input and expressive AI narration for more natural learning",
      "Smart notes, study productivity, and content creation tools planned for launch",
    ],
    outcomes: [
      "Positioned Amatic.ai as a learning workspace rather than a generic chatbot.",
      "Built around a canvas-first teaching model where AI can respond to drawings, text, voice, and context.",
      "Connected multiple AI providers into one educational workflow: Claude for reasoning, Gemini for visuals, and ElevenLabs for voice.",
      "Created a foundation for students to self-study and for teachers to explain concepts more visually.",
    ],
    metrics: [
      { label: "Mode", value: "canvas AI" },
      { label: "Learning", value: "voice + visuals" },
      { label: "Company", value: "Raptorvoid" },
    ],
  },
  {
    slug: "pensil-io",
    name: "pensil.io",
    category: "ai",
    kind: "Large Next.js product",
    tagline: "Large Next.js application with testing, docs, scripts, and production-oriented product iteration.",
    stack: [
      "Next.js",
      "TypeScript",
      "Playwright",
      "Jest",
      "Scripts",
      "Docs",
      "GitHub Actions",
      "CI/CD",
      "Docker",
      "Terraform",
      "AWS",
    ],
    summary:
      "A larger product codebase that reflects structured app development, testing, documentation, and operational thinking around shipping changes safely.",
    problem:
      "Larger product codebases become difficult to change unless testing, documentation, scripts, and repeatable verification are part of the workflow.",
    architecture: ["Next.js app", "TypeScript", "Playwright checks", "Jest tests", "Automation scripts", "Documentation"],
    highlights: [
      "Playwright and Jest present in the stack",
      "Script and docs-heavy workflow",
      "Product iteration with engineering hygiene",
    ],
    outcomes: [
      "Worked in a structure where automated checks and docs support product iteration.",
      "Treated scripts as part of the development and release workflow.",
      "Focused on engineering hygiene while working across a larger app surface.",
    ],
    metrics: [
      { label: "Checks", value: "Jest + Playwright" },
      { label: "Codebase", value: "Next.js" },
      { label: "Workflow", value: "docs + scripts" },
    ],
  },
];

export const featuredProjects = projects.slice(0, 3);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const timeline = [
  {
    title: "Prometheus",
    period: "2026",
    description:
      "Control-plane APIs, Celery topology, alerting and schedules—all packaged for repeatable Docker Compose bring-up that maps cleanly onto cloud VMs or future K8s targets.",
  },
  {
    title: "Abhi2.0 / Latenite.ai / Zero.AI",
    period: "2025 - 2026",
    description:
      "Container-shaped AI stacks (Compose, proxies, probes) wired to Postgres, Redis, BullMQ/Socket workloads, Terraform-friendly environment boundaries.",
  },
  {
    title: "ServerQC Pro / EduStack / Amatic.ai",
    period: "2025 - 2026",
    description:
      "Hardware validation tooling, SaaS-ish delivery concerns, Telegram product ops, Firebase + edge APIs—with CI/CD and scripted checks where releases matter.",
  },
];
