"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  brandingName,
  featuredProjects,
  focusAreas,
  profile,
  projects,
  skills,
  startup,
  timeline,
  type Project,
  type ProjectCategory,
} from "@/lib/portfolio-data";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";

declare global {
  interface Window {
    initLegacySite?: () => void;
  }
}

const categoryLabels: Record<ProjectCategory, string> = {
  platform: "Platform",
  automation: "Automation",
  ai: "AI Systems",
};

function StackBadges({ stack }: { stack: string[] }) {
  return (
    <div className="stack-badges">
      {stack.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <div className={`project-visual ${large ? "project-visual-large" : ""} project-visual-${project.category}`}>
      <div className="visual-topline">
        <span>{categoryLabels[project.category]}</span>
        <strong>{project.name}</strong>
      </div>
      <div className="visual-flow" aria-hidden="true">
        {project.architecture.slice(0, large ? 6 : 4).map((node, index) => (
          <span key={node} className="visual-node">
            <i className={`bi ${["bi-window", "bi-hdd-network", "bi-database", "bi-arrow-repeat", "bi-activity", "bi-box"][index % 6]}`}></i>
            {node}
          </span>
        ))}
      </div>
      <div className="visual-status">
        {project.metrics.map((metric) => (
          <span key={metric.label}>
            <strong>{metric.value}</strong>
            {metric.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article className={`project-card ${featured ? "project-card-featured" : ""}`}>
      <ProjectVisual project={project} />
      <div className="project-card-body">
        <span className="project-kind">{project.kind}</span>
        <h3>{project.name}</h3>
        <p>{project.tagline}</p>
        <StackBadges stack={project.stack} />
        <Link href={`/portfolio/${project.slug}`} className="project-link" aria-label={`View ${project.name} case study`}>
          View case study <i className="bi bi-arrow-right" aria-hidden="true"></i>
        </Link>
      </div>
    </article>
  );
}

function subscribeHashChange(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function readHashSegment() {
  if (typeof window === "undefined") return "home";
  return window.location.hash.slice(1) || "home";
}

/** Map top-level routes (not case-study) to landing hash keys for active nav state */
function routeSectionKey(pathname: string): string | undefined {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!seg) return undefined;
  const map: Record<string, string> = {
    about: "about",
    resume: "resume",
    services: "services",
    contact: "contact",
    portfolio: "portfolio",
    "portfolio-details": "portfolio",
  };
  return map[seg];
}

function Header() {
  const pathname = usePathname();
  const navScrollRef = useRef<HTMLUListElement | null>(null);
  const hashKey = useSyncExternalStore(subscribeHashChange, readHashSegment, () => "home");

  useLayoutEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    el.scrollLeft = 0;
  }, [pathname]);

  const pathParts = pathname.split("/").filter(Boolean);
  const isCaseStudy =
    pathParts[0] === "portfolio" && pathParts.length >= 2 && Boolean(pathParts[1]);

  const activeKey = isCaseStudy
    ? "portfolio"
    : pathname === "/"
      ? hashKey
      : routeSectionKey(pathname) ?? "home";

  const items: { href: string; label: string; shortLabel: string; key: string }[] = [
    { href: "/#about", label: "About", shortLabel: "About", key: "about" },
    { href: "/#resume", label: "Resume", shortLabel: "CV", key: "resume" },
    { href: "/#services", label: "Expertise", shortLabel: "Skills", key: "services" },
    { href: "/#portfolio", label: "Portfolio", shortLabel: "Work", key: "portfolio" },
    { href: "/#contact", label: "Contact", shortLabel: "Mail", key: "contact" },
  ];

  return (
    <header id="header" className="header light-background sticky-top w-100">
      <div className="container-fluid header-toolbar position-relative d-flex flex-nowrap align-items-center justify-content-between gap-2 min-w-0">
        <Link
          href="/#home"
          className="logo site-logo-link d-inline-flex align-items-center flex-shrink-0 text-decoration-none"
          aria-label={`${brandingName}, home`}
        >
          <SiteLogo className="header-site-logo" size={30} />
        </Link>
        <nav
          id="navmenu"
          className="navmenu navmenu-unified header-nav-cluster d-flex flex-nowrap align-items-center justify-content-end flex-shrink-1 min-w-0 gap-1"
          aria-label="Primary"
        >
          <ul
            ref={navScrollRef}
            className="navmenu-scroll d-flex flex-nowrap align-items-center mb-0 ps-0 flex-shrink-1 min-w-0"
          >
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={activeKey === item.key ? "active" : undefined}
                  aria-label={item.label}
                >
                  <span className="d-none d-md-inline">{item.label}</span>
                  <span className="d-md-none" aria-hidden="true">
                    {item.shortLabel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="navmenu-tail d-flex align-items-center flex-shrink-0">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer id="footer" className="footer light-background">
      <div className="container">
        <div className="copyright text-center ">
          <p>
            &copy; <span>Copyright</span>{" "}
            <Link
              href="/#home"
              className="footer-brand-mark logo-inline d-inline-flex align-middle text-decoration-none"
              aria-label={`${brandingName}, home`}
            >
              <SiteLogo size={26} />
            </Link>{" "}
            <span>All Rights Reserved</span>
          </p>
        </div>
        <div className="credits">Built to showcase AI engineering, LLM apps, automation, and platform work.</div>
      </div>
    </footer>
  );
}

export function LegacyShell({
  bodyClassName,
  children,
}: {
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!bodyClassName) return;

    document.body.classList.add(bodyClassName);

    return () => {
      document.body.classList.remove(bodyClassName);
    };
  }, [bodyClassName]);

  useEffect(() => {
    window.initLegacySite?.();
  }, [pathname]);

  return (
    <>
      <Header />
      {children}
      <Footer />
      <a
        href="#home"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
        aria-label="Back to top"
      >
        <i className="bi bi-arrow-up-short" aria-hidden="true"></i>
      </a>
    </>
  );
}

export function HomeContent() {
  return (
    <>
      <section id="home" className="hero section portfolio-hero">
        <div className="container" data-aos="fade-up">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <span className="hero-kicker">{profile.role}</span>
              <h1 className="hero-title mb-0">{brandingName}</h1>
              <p>
                AI Engineer building LLM-powered applications and agentic automation—RAG pipelines, AI agents, and MCP servers—on a strong Linux and
                server-infrastructure base. Full-stack delivery from model integration through deployment, plus HPC/GPU benchmarking on NVIDIA B200/B300 servers.
              </p>
              <div className="hero-actions">
                <Link href="/#portfolio" className="btn-get-started">
                  View Projects
                </Link>
                <Link href="/#contact" className="btn-secondary-action">
                  Contact Me
                </Link>
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn-icon-action" aria-label={`${brandingName} on GitHub`}>
                  <i className="bi bi-github" aria-hidden="true"></i>
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-icon-action" aria-label={`${brandingName} on LinkedIn`}>
                  <i className="bi bi-linkedin" aria-hidden="true"></i>
                </a>
                <a href={`mailto:${profile.email}`} className="btn-icon-action" aria-label={`Email ${brandingName}`}>
                  <i className="bi bi-envelope" aria-hidden="true"></i>
                </a>
              </div>
              <div className="hero-proof">
                <span><strong>{projects.length}+</strong> shipped projects</span>
                <span><strong>LLM agents</strong> + MCP servers</span>
                <span><strong>HPC/GPU</strong> benchmarking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-projects section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Featured Projects</h2>
          <p>Selected systems showing LLM applications, AI agents, automation, and full-stack product work.</p>
        </div>
        <div className="container">
          <div className="row gy-4">
            {featuredProjects.map((project) => (
              <div className="col-lg-4" key={project.slug} data-aos="fade-up">
                <ProjectCard project={project} featured />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="startup-section section">
        <div className="container">
          <div className="startup-band" data-aos="fade-up">
            <div>
              <span className="hero-kicker">{startup.role}</span>
              <h2>{startup.name}</h2>
              <p>{startup.summary}</p>
              <div className="startup-actions">
                <a href={startup.website} target="_blank" rel="noreferrer" className="btn-get-started">
                  Visit {startup.product}
                </a>
                <Link href="/portfolio/amatic-ai" className="btn-secondary-action">
                  View startup case study
                </Link>
              </div>
            </div>
            <div className="startup-focus">
              <h3>{startup.product}</h3>
              <p>{startup.tagline}</p>
              <ul>
                {startup.focus.map((item) => (
                  <li key={item}>
                    <i className="bi bi-check2-circle" aria-hidden="true"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutContent() {
  const skillsMidpoint = Math.ceil(skills.length / 2);

  return (
    <>
      <section id="about" className="about section">
        <div className="container section-title" data-aos="fade-up">
          <h2>About</h2>
          <p>AI-focused work across LLM applications, RAG pipelines, AI agents and MCP servers, full-stack products, and HPC/GPU benchmarking—on a strong Linux and server-infrastructure base.</p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4 justify-content-center">
            <div className="col-lg-4">
              <div className="about-snapshot" aria-label="Profile capability snapshot">
                <div className="snapshot-command">$ agent run --task benchmark</div>
                <div className="snapshot-line ok">mcp server connected</div>
                <div className="snapshot-line ok">rag index ready</div>
                <div className="snapshot-line ok">claude api streaming</div>
                <div className="snapshot-line warn">gpu benchmark running</div>
                <div className="snapshot-summary">
                  <strong>Focus</strong>
                  <span>LLM apps and agents that are grounded, evaluated, and easy to operate.</span>
                </div>
              </div>
            </div>
            <div className="col-lg-8 content">
              <h2>AI Engineer focused on LLM applications, agentic automation, and full-stack delivery.</h2>
              <p className="fst-italic py-3">
                I build LLM-powered applications and AI agents that are grounded, evaluated, and easy to operate—on
                a strong Linux and server-infrastructure base. I am also building {startup.product} under {startup.name},
                focused on AI-assisted self-study for students and smarter teaching workflows for teachers.
              </p>
              <div className="row">
                <div className="col-lg-6">
                  <ul>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Focus:</strong> <span>AI Engineering — LLM apps, agents & MCP; platform / infra base</span></li>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Name:</strong> <span>{brandingName}</span></li>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Date of Birth:</strong> <span>{profile.dob}</span></li>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Location:</strong> <span>Noida, India</span></li>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>AI / LLM:</strong> <span>RAG, vector DBs, AI agents, MCP servers, LLM APIs (Claude, OpenAI, Gemini)</span></li>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Data Layer:</strong> <span>PostgreSQL, Redis, MongoDB, Qdrant</span></li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <ul>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Backend:</strong> <span>FastAPI, Express, Node.js, Python, Go</span></li>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Degree:</strong> <span>{profile.degree}</span></li>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Email:</strong> <span>{profile.email}</span></li>
                    <li><i className="bi bi-chevron-right" aria-hidden="true"></i> <strong>Phone:</strong> <span>{profile.phone}</span></li>
                  </ul>
                </div>
              </div>
              <p className="py-3">
                My recent work spans LLM-powered products, AI agents and MCP servers, internal automation, and
                HPC/GPU benchmarking. Across Prometheus, Abhi2.0, Latenite.ai, Zero.AI, EduStack, and {startup.product},
                I have worked with RAG pipelines, vector search, LLM API integration, background workers, realtime
                events, and production-oriented local environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="skills section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Skills</h2>
          <p>Built from the stack choices and architecture patterns used across my recent projects.</p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row skills-content skills-animation">
            <div className="col-lg-6">
              {skills.slice(0, skillsMidpoint).map((skill) => (
                <div
                  className="progress"
                  key={skill.label}
                  role="group"
                  aria-label={`${skill.label}, self-assessed emphasis ${skill.value} percent`}
                >
                  <span className="skill"><span>{skill.label}</span> <i className="val">{skill.value}%</i></span>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar" role="progressbar" aria-valuenow={skill.value} aria-valuemin={0} aria-valuemax={100} aria-label={skill.label}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-6">
              {skills.slice(skillsMidpoint).map((skill) => (
                <div
                  className="progress"
                  key={skill.label}
                  role="group"
                  aria-label={`${skill.label}, self-assessed emphasis ${skill.value} percent`}
                >
                  <span className="skill"><span>{skill.label}</span> <i className="val">{skill.value}%</i></span>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar" role="progressbar" aria-valuenow={skill.value} aria-valuemin={0} aria-valuemax={100} aria-label={skill.label}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ResumeContent() {
  return (
    <>
      <section id="resume" className="resume section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Resume</h2>
          <p>A concise view of my AI engineering experience, tooling, and production-style project work.</p>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <h3 className="resume-title">Summary</h3>
              <div className="resume-item pb-0">
                <h4>{brandingName}</h4>
                <p><em>AI Engineer building LLM-powered applications and agentic automation—RAG pipelines, AI agents, and MCP servers—on a strong Linux and server-infrastructure base. Full-stack delivery (Next.js, FastAPI, Node.js) plus HPC/GPU benchmarking on NVIDIA B200/B300.</em></p>
                <ul>
                  <li>{profile.city}</li>
                  <li>{profile.phone}</li>
                  <li>{profile.email}</li>
                </ul>
              </div>

              <h3 className="resume-title">Core Stack</h3>
              <div className="resume-item">
                <h4>{startup.name}</h4>
                <h5>{startup.role}</h5>
                <p><em>{startup.product} - education AI platform for students and teachers</em></p>
                <p>{startup.summary}</p>
              </div>
              <div className="resume-item">
                <h4>AI / LLM Engineering</h4>
                <h5>Primary focus</h5>
                <p><em>RAG pipelines, vector databases (Qdrant), embeddings, AI agents, MCP servers, tool use / function calling, structured outputs, prompt engineering, evaluation, and LLM APIs (Claude, OpenAI, Gemini).</em></p>
                <p>I build LLM apps that are grounded in domain data, evaluated for quality, and wired into real systems through agents and MCP servers rather than one-off chat calls.</p>
              </div>
              <div className="resume-item">
                <h4>Full-Stack, Data &amp; Infrastructure</h4>
                <h5>Primary focus</h5>
                <p><em>Next.js, React, Node.js, Express, FastAPI, PostgreSQL, MongoDB, Redis, BullMQ, Socket.io; Docker, AWS, Vercel, GitHub Actions, Linux administration; HPC/GPU benchmarking (NVIDIA B200/B300, MLPerf, HPL-AI), BMC/BIOS & GPU firmware, IPMI, SSH automation.</em></p>
                <p>Most of my systems pair durable data stores and background workers with a Linux and server-infrastructure base I can operate, benchmark, and automate.</p>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <h3 className="resume-title">Selected Project Experience</h3>
              {timeline.map((item) => (
                <div className="resume-item" key={item.title}>
                  <h4>{item.title}</h4>
                  <h5>{item.period}</h5>
                  <p><em>AI engineering and full-stack system work</em></p>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ServicesContent() {
  const iconClasses = [
    "bi-box-seam",
    "bi-cloud-upload",
    "bi-arrow-repeat",
    "bi-diagram-3",
    "bi-activity",
    "bi-gear-wide-connected",
  ];

  return (
    <>
      <section id="services" className="services section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Expertise</h2>
          <p>AI engineering expertise: LLM applications, AI agents & MCP servers, RAG, full-stack delivery, HPC/GPU benchmarking, and a solid platform and infrastructure base.</p>
        </div>
        <div className="container">
          <div className="row gy-4">
            {focusAreas.map((item, index) => (
              <div className="col-lg-6 col-md-6" data-aos="fade-up" data-aos-delay={(index + 1) * 100} key={item.title}>
                <div className="service-item item-cyan position-relative h-100">
                  <div className="icon">
                    <svg width="100" height="100" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                      <path stroke="none" strokeWidth="0" fill="#f5f5f5" d="M300,521.0016835830174C376.1290562159157,517.8887921683347,466.0731472004068,529.7835943286574,510.70327084640275,468.03025145048787C554.3714126377745,407.6079735673963,508.03601936045806,328.9844924480964,491.2728898941984,256.3432110539036C474.5976632858925,184.082847569629,479.9380746630129,96.60480741107993,416.23090153303,58.64404602377083C348.86323505073057,18.502131276798302,261.93793281208167,40.57373210992963,193.5410806939664,78.93577620505333C130.42746243093433,114.334589627462,98.30271207620316,179.96522072025542,76.75703585869454,249.04625023123273C51.97151888228291,328.5150500222984,13.704378332031375,421.85034740162234,66.52175969318436,486.19268352777647C119.04800174914682,550.1803526380478,217.28368757567262,524.383925680826,300,521.0016835830174"></path>
                    </svg>
                    <i className={`bi ${iconClasses[index % iconClasses.length]}`} aria-hidden="true"></i>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Link
                    href="/#portfolio"
                    className="stretched-link"
                    aria-label={`Open portfolio — ${item.title}`}
                  >
                    <span className="visually-hidden">View portfolio projects</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PortfolioFilters() {
  const [activeFilter, setActiveFilter] = useState<"all" | ProjectCategory>("all");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const filterEntries: Array<{ label: string; value: "all" | ProjectCategory }> = [
    { label: "All", value: "all" },
    { label: "Platform", value: "platform" },
    { label: "Automation", value: "automation" },
    { label: "AI Systems", value: "ai" },
  ];

  const filterLabel =
    activeFilter === "all" ? "All categories" : categoryLabels[activeFilter];

  return (
    <>
      <p id="portfolio-filter-status" className="visually-hidden" aria-live="polite" aria-atomic="true">
        {visibleProjects.length} project{visibleProjects.length === 1 ? "" : "s"} — filter: {filterLabel}.
      </p>
      <ul className="portfolio-filters" data-aos="fade-up" data-aos-delay="100">
        {filterEntries.map((filter) => (
          <li key={filter.value}>
            <button
              type="button"
              className={`portfolio-filter-btn ${activeFilter === filter.value ? "filter-active" : ""}`}
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="row gy-4 project-grid" data-aos="fade-up" data-aos-delay="200">
        {visibleProjects.map((project) => (
          <div className={`col-lg-4 col-md-6 portfolio-item`} key={project.slug}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </>
  );
}

export function PortfolioContent() {
  return (
    <>
      <section id="portfolio" className="portfolio section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Portfolio</h2>
          <p>Project case studies structured around problem, architecture, implementation focus, and outcomes.</p>
        </div>
        <div className="container">
          <div className="portfolio-react-grid">
            <PortfolioFilters />
          </div>
        </div>
      </section>
    </>
  );
}

export function PortfolioDetailsContent({ project = projects[0] }: { project?: Project }) {

  return (
    <main className="main">
      <section id="portfolio-details" className="portfolio-details section">
        <div className="container section-title" data-aos="fade-up">
          <h2>{project.name}</h2>
          <p>{project.tagline}</p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-8">
              <ProjectVisual project={project} large />
            </div>

            <div className="col-lg-4">
              <div className="portfolio-info" data-aos="fade-up" data-aos-delay="200">
                <h3>Project information</h3>
                <ul>
                  <li><strong>Project</strong>: {project.name}</li>
                  <li><strong>Category</strong>: {categoryLabels[project.category]}</li>
                  <li><strong>Type</strong>: {project.kind}</li>
                  <li><strong>Stack</strong>: {project.stack.join(", ")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="case-study-body" data-aos="fade-up" data-aos-delay="200">
            <div className="case-study-section">
              <span>01</span>
              <div>
                <h3>Problem</h3>
                <p>{project.problem}</p>
              </div>
            </div>
            <div className="case-study-section">
              <span>02</span>
              <div>
                <h3>Architecture</h3>
                <div className="architecture-list">
                  {project.architecture.map((item) => (
                    <strong key={item}>{item}</strong>
                  ))}
                </div>
              </div>
            </div>
            <div className="case-study-section">
              <span>03</span>
              <div>
                <h3>What I Focused On</h3>
                <ul>
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="case-study-section">
              <span>04</span>
              <div>
                <h3>Outcome</h3>
                <ul>
                  {project.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const submittingRef = useRef(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setStatus("loading");
    setMessage("");

    try {
      const form = new FormData(event.currentTarget);
      const payload = {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong.");
        return;
      }

      event.currentTarget.reset();
      setStatus("success");
      setMessage(data.message ?? "Message received successfully.");
    } catch {
      setStatus("error");
      setMessage("Unable to send the message right now. Please try again.");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="php-email-form"
      data-aos="fade-up"
      data-aos-delay="200"
      aria-busy={status === "loading"}
    >
      <div className="row gy-4">
        <div className="col-md-6">
          <label htmlFor="name-field" className="pb-2">Your Name</label>
          <input type="text" name="name" id="name-field" className="form-control" required disabled={status === "loading"} />
        </div>
        <div className="col-md-6">
          <label htmlFor="email-field" className="pb-2">Your Email</label>
          <input type="email" className="form-control" name="email" id="email-field" required disabled={status === "loading"} />
        </div>
        <div className="col-md-12">
          <label htmlFor="subject-field" className="pb-2">Subject</label>
          <input type="text" className="form-control" name="subject" id="subject-field" required disabled={status === "loading"} />
        </div>
        <div className="col-md-12">
          <label htmlFor="message-field" className="pb-2">Message</label>
          <textarea className="form-control" name="message" rows={10} id="message-field" required disabled={status === "loading"} />
        </div>
        <div className="col-md-12 text-center">
          {status === "loading" ? <div className="loading d-block" aria-hidden="true">Loading</div> : null}
          {status === "error" ? <div className="error-message d-block" role="alert">{message}</div> : null}
          {status === "success" ? <div className="sent-message d-block" role="status" aria-live="polite">{message}</div> : null}
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Send Message"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function ContactContent() {
  return (
    <>
      <section id="contact" className="contact section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Contact</h2>
          <p>Reach out for AI engineering, LLM applications, agents & automation, full-stack, and infrastructure-focused opportunities.</p>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            <div className="col-lg-5">
              <div className="info-wrap">
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="200">
                  <i className="bi bi-geo-alt flex-shrink-0" aria-hidden="true"></i>
                  <div>
                    <h3>Address</h3>
                    <p>{profile.city}</p>
                  </div>
                </div>
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300">
                  <i className="bi bi-telephone flex-shrink-0" aria-hidden="true"></i>
                  <div>
                    <h3>Call Me</h3>
                    <p>{profile.phone}</p>
                  </div>
                </div>
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="400">
                  <i className="bi bi-envelope flex-shrink-0" aria-hidden="true"></i>
                  <div>
                    <h3>Email Me</h3>
                    <p>{profile.email}</p>
                  </div>
                </div>
                <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="500">
                  <i className="bi bi-person-lines-fill flex-shrink-0" aria-hidden="true"></i>
                  <div>
                    <h3>Profiles</h3>
                    <p>
                      <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
                      {" · "}
                      <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    </p>
                  </div>
                </div>
                <iframe
                  title="Map of Noida, Uttar Pradesh, India"
                  src="https://www.google.com/maps?q=Noida%2C%20Uttar%20Pradesh%2C%20India&z=11&output=embed"
                  frameBorder="0"
                  style={{ border: 0, width: "100%", height: "270px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="col-lg-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function UnifiedLandingContent() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    function scrollIntoHashSection() {
      const id = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
      window.requestAnimationFrame(() => {
        if (!id || id === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    scrollIntoHashSection();
    window.addEventListener("hashchange", scrollIntoHashSection);
    return () => window.removeEventListener("hashchange", scrollIntoHashSection);
  }, [pathname]);

  return (
    <main className="main">
      <HomeContent />
      <AboutContent />
      <ResumeContent />
      <ServicesContent />
      <PortfolioContent />
      <ContactContent />
    </main>
  );
}
