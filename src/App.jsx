import { useEffect, useMemo, useRef, useState } from "react";

const roles = [
  "Data Governance Software Engineer",
  "Python Developer",
  "Full Stack Developer",
  "Programming Intern",
];

const experience = [
  {
    company: "WeVision Technologies",
    role: "Data Governance Software Engineer",
    period: "Mar 2026 - Present",
    place: "Kuala Lumpur",
    headline: "Governed data at production scale",
    body:
      "Maintained consent ETL pipelines and Databricks Unity Catalog views that keep dashboard reporting reliable. Traced source data and transformations to uncover a 15M-record coverage gap, then validated the metrics that business teams depend on.",
    tags: ["Databricks", "Unity Catalog", "SQL", "Datadog"],
  },
  {
    company: "AMZ Solutions",
    role: "Python Developer",
    period: "Oct 2025 - Jan 2026",
    place: "Kuala Lumpur",
    headline: "Low-latency analytics for market data",
    body:
      "Automated Python ETL pipelines for daily market and cross-asset risk data. Built REST APIs for internal trading analytics so teams could retrieve cleaner data faster during real-time decisions.",
    tags: ["Python", "REST APIs", "ETL", "Risk data"],
  },
  {
    company: "Solution Engineering",
    role: "Full Stack Developer",
    period: "Jun 2024 - Sep 2025",
    place: "Kuala Lumpur",
    headline: "Digital twin systems for engineering teams",
    body:
      "Delivered a backend platform for 15 engineering simulation models with real-time interaction. Added Casbin RBAC with SQL-backed policies for 30+ organizations and multilayered user roles.",
    tags: ["React", "RBAC", "PostgreSQL", "Simulation"],
  },
  {
    company: "Robotics Learning",
    role: "Programming Intern",
    period: "Jul 2023 - Sep 2023",
    place: "Kuala Lumpur",
    headline: "Where automation became practical",
    body:
      "Automated robotic mechanism and control workflows with Python while mentoring students through programming fundamentals and project comprehension.",
    tags: ["Python", "Robotics", "Teaching"],
  },
];

const projects = [
  {
    name: "Digital Twin Engineering Simulation",
    type: "systems",
    metric: "15",
    label: "simulation models",
    copy:
      "React-based digital twin interface for monitoring live engineering equipment, controlling simulations in real time, and reducing repeated build effort through reusable components.",
    stack: ["React", "Backend APIs", "Live data", "Conversational AI"],
  },
  {
    name: "LLM Agent API Backend",
    type: "ai",
    metric: "15",
    label: "manuals searchable",
    copy:
      "A rate-limited RAG API that lets engineers query internal documentation directly, with structured errors and per-client throttling under concurrent AI load.",
    stack: ["RAG", "FastAPI", "Rate limiting", "API design"],
  },
  {
    name: "Consent Analytics Dashboard",
    type: "data",
    metric: "8",
    label: "interactive tabs",
    copy:
      "Redesigned static reporting into a tabbed analytics surface with filters and optimized aggregation for faster operational visibility.",
    stack: ["Databricks", "SQL", "Dashboard UX", "Data quality"],
  },
];

const skillGroups = [
  ["Data", "Python", "SQL", "ETL/ELT", "Data quality", "Data governance"],
  ["Platforms", "Databricks", "Unity Catalog", "AWS S3", "DynamoDB"],
  ["Backend", "FastAPI", "SQLAlchemy", "PostgreSQL", "Docker", "Git"],
  ["Ops", "Apache Airflow", "Datadog", "PagerDuty", "Production monitoring"],
];

function SignalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    const nodes = Array.from({ length: 34 }, (_, index) => ({
      x: (index * 97) % 100,
      y: (index * 53) % 100,
      phase: index * 0.47,
      radius: 1.3 + (index % 4) * 0.45,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      frame += 0.006;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(18, 15, 13, 0.72)";
      ctx.fillRect(0, 0, width, height);
      const points = nodes.map((node) => ({
        x: (node.x / 100) * width + Math.sin(frame + node.phase) * 18,
        y: (node.y / 100) * height + Math.cos(frame * 1.2 + node.phase) * 14,
        radius: node.radius,
      }));

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 138) {
            const alpha = (1 - distance / 138) * 0.18;
            ctx.strokeStyle = `rgba(128, 213, 199, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      points.forEach((point, index) => {
        const pulse = 0.5 + Math.sin(frame * 5 + index) * 0.5;
        ctx.fillStyle = index % 7 === 0 ? "rgba(245, 197, 138, 0.9)" : "rgba(128, 213, 199, 0.82)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius + pulse * 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}

export function App() {
  const [activeProject, setActiveProject] = useState("systems");
  const [activeSection, setActiveSection] = useState("intro");
  const activeProjectData = useMemo(
    () => projects.find((project) => project.type === activeProject) ?? projects[0],
    [activeProject],
  );

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.getAttribute("data-section"));
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.18, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio-shell">
      <nav className="side-rail" aria-label="Section progress">
        <span className="rail-word">{activeSection}</span>
        <span className="rail-line" />
      </nav>

      <section className="hero" data-section="intro">
        <div className="hero-copy">
          <p className="system-label">[ aman shabilin ]</p>
          <h1>Software engineer for data systems that stay accountable.</h1>
          <p className="hero-text">
            I build production data infrastructure, backend services, and operational dashboards where correctness, latency, and clarity all matter.
          </p>
          <div className="hero-actions">
            <a href="mailto:amanbilin13@gmail.com" className="primary-link">Contact</a>
            <a href="https://github.com/aman-shabilin" className="text-link">GitHub</a>
            <a href="https://linkedin.com/in/amanbilin" className="text-link">LinkedIn</a>
          </div>
        </div>

        <div className="system-board" aria-label="Capability signal map">
          <SignalCanvas />
          <div className="board-topline">
            <span>production signal</span>
            <strong>20+ incidents weekly</strong>
          </div>
          <div className="board-readout">
            <span className="readout-number">15M</span>
            <span>record coverage gap traced through source data and transformations</span>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Key outcomes" data-section="proof">
        <div><strong>~2 yrs</strong><span>production engineering</span></div>
        <div><strong>30+</strong><span>organizations behind RBAC policies</span></div>
        <div><strong>8</strong><span>dashboard tabs replacing static reporting</span></div>
      </section>

      <section className="journey" data-section="journey">
        <aside className="journey-intro">
          <p className="system-label">[ operational path ]</p>
          <h2>Where the systems sharpened.</h2>
          <p>
            From chemical engineering into software, the through-line is practical: model the process, inspect the failure, and ship the interface people can trust.
          </p>
          <div className="progress-scale">
            <span>foundation</span>
            <i />
            <span>now</span>
          </div>
        </aside>
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item" key={item.company}>
              <span className="dot" />
              <p className="meta-line">{item.company} - {item.role}</p>
              <p className="sub-meta">{item.place} - {item.period}</p>
              <h3>{item.headline}</h3>
              <p>{item.body}</p>
              <div className="tag-row">
                {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projects" data-section="work">
        <div className="section-heading">
          <p className="system-label">[ selected proof ]</p>
          <h2>Projects built like operating systems, not portfolio tiles.</h2>
        </div>
        <div className="project-switcher" role="tablist" aria-label="Project selector">
          {projects.map((project) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeProject === project.type}
              className={activeProject === project.type ? "active" : ""}
              onClick={() => setActiveProject(project.type)}
              key={project.type}
            >
              {project.type}
            </button>
          ))}
        </div>
        <article className="project-stage">
          <div className="project-metric">
            <strong>{activeProjectData.metric}</strong>
            <span>{activeProjectData.label}</span>
          </div>
          <div>
            <p className="meta-line">{activeProjectData.name}</p>
            <h3>{activeProjectData.copy}</h3>
            <div className="stack-list">
              {activeProjectData.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </article>
      </section>

      <section className="skills" data-section="stack">
        <div className="section-heading">
          <p className="system-label">[ toolkit ]</p>
          <h2>Comfortable at the layer where data, APIs, and users meet.</h2>
        </div>
        <div className="skill-matrix">
          {skillGroups.map(([label, ...items]) => (
            <div className="skill-group" key={label}>
              <strong>{label}</strong>
              {items.map((item) => <span key={item}>{item}</span>)}
            </div>
          ))}
        </div>
      </section>

      <section className="contact" data-section="contact">
        <p className="system-label">[ next system ]</p>
        <h2>Need an engineer who can trace the data and design the interface around it?</h2>
        <a href="mailto:amanbilin13@gmail.com" className="contact-link">amanbilin13@gmail.com</a>
      </section>
    </main>
  );
}
