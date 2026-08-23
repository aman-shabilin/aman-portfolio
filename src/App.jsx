import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import SpecularButton from "./SpecularButton";

const roles = [
  "Data Governance Software Engineer",
  "Python Developer",
  "Full Stack Developer",
  "Programming Intern",
];

const experience = [
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
    company: "WeVision Technologies",
    role: "Data Governance Software Engineer",
    period: "Mar 2026 - Present",
    place: "Kuala Lumpur",
    headline: "Governed data at production scale",
    body:
      "Maintained consent ETL pipelines and Databricks Unity Catalog views that keep dashboard reporting reliable. Traced source data and transformations to uncover a 15M-record coverage gap, then validated the metrics that business teams depend on.",
    tags: ["Databricks", "Unity Catalog", "SQL", "Datadog"],
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
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, 1.5) });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: `#version 300 es
        in vec2 position;
        void main() { gl_Position = vec4(position, 0.0, 1.0); }`,
      fragment: `#version 300 es
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        out vec4 fragColor;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / uResolution;
          float t = uTime * 0.15;

          vec2 mouse = uMouse;
          float mouseDist = length(uv - mouse);
          float mouseInfluence = smoothstep(0.35, 0.0, mouseDist);

          vec2 distortedUv = uv + mouseInfluence * 0.06 * normalize(uv - mouse + 0.001);

          float n1 = snoise(vec3(distortedUv * 1.8, t * 0.4));
          float n2 = snoise(vec3(distortedUv * 3.2 + 5.0, t * 0.3 + 10.0));
          float n3 = snoise(vec3(distortedUv * 5.0 + n1 * 0.5, t * 0.2));

          float flow = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
          flow = flow * 0.5 + 0.5;

          vec3 deep = vec3(0.05, 0.065, 0.11);
          vec3 mid = vec3(0.09, 0.12, 0.19);
          vec3 highlight = vec3(0.17, 0.22, 0.30);
          vec3 glow = vec3(0.22, 0.30, 0.42);

          vec3 col = mix(deep, mid, smoothstep(0.3, 0.6, flow));
          col = mix(col, highlight, smoothstep(0.65, 0.9, flow) * 0.6);
          col = mix(col, glow, mouseInfluence * 0.6);

          float vignette = 1.0 - length((uv - 0.5) * 1.3);
          col *= smoothstep(0.0, 0.7, vignette);

          fragColor = vec4(col, 1.0);
        }`,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w * renderer.dpr, h * renderer.dpr];
    };
    window.addEventListener("resize", resize);
    resize();

    let mouseX = 0.5, mouseY = 0.5;
    let targetX = 0.5, targetY = 0.5;
    const onPointerMove = (e) => {
      targetX = e.clientX / window.innerWidth;
      targetY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onPointerMove);

    let raf = 0;
    let start = performance.now();
    const draw = () => {
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      program.uniforms.uMouse.value = [mouseX, mouseY];
      program.uniforms.uTime.value = (performance.now() - start) / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={containerRef} className="signal-canvas" aria-hidden="true" />;
}

function useReveal() {
  const ref = useCallback((node) => {
    if (!node) return;
    const elements = node.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
  }, []);
  return ref;
}

export function App() {
  const [activeProject, setActiveProject] = useState("systems");
  const [activeSection, setActiveSection] = useState("intro");
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineRef = useRef(null);
  const activeProjectData = useMemo(
    () => projects.find((project) => project.type === activeProject) ?? projects[0],
    [activeProject],
  );

  useEffect(() => {
    const updateProgress = () => {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = rect.top - viewH * 0.75;
      const end = rect.bottom - viewH * 0.35;
      const range = end - start;
      if (range <= 0) return;
      const progress = Math.min(1, Math.max(0, -start / range));
      setTimelineProgress(progress);
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-section]"));
    const handleScroll = () => {
      const midpoint = window.innerHeight * 0.4;
      let closest = null;
      let closestDist = Infinity;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const dist = Math.abs(rect.top - midpoint);
        if (rect.top < window.innerHeight && rect.bottom > 0 && dist < closestDist) {
          closestDist = dist;
          closest = section;
        }
      }
      if (closest) setActiveSection(closest.getAttribute("data-section"));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const revealRef = useReveal();

  return (
    <main className="portfolio-shell" ref={revealRef}>
      <SignalCanvas />
      <nav className="side-rail" aria-label="Section progress">
        {[
          { id: "intro", label: "Intro" },
          { id: "journey", label: "Experience" },
          { id: "work", label: "Projects" },
          { id: "stack", label: "Stack" },
          { id: "contact", label: "Contact" },
        ].map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`rail-item${activeSection === section.id ? " active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(`[data-section="${section.id}"]`)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="rail-dot" />
            <span className="rail-label">{section.label}</span>
          </a>
        ))}
      </nav>

      <section className="hero" data-section="intro">
        <div className="hero-copy" data-reveal>
          <p className="roles-line">{roles.join(" · ")}</p>
          <h1>Aman Shabilin</h1>
          <p className="hero-text">
            I build production data infrastructure, backend services, and operational dashboards where correctness, latency, and clarity all matter.
          </p>
          <div className="hero-actions">
            <SpecularButton
              size="md"
              radius={8}
              lineColor="#80d5c7"
              baseColor="#3a3a3a"
              textColor="#f5f5f5"
              autoAnimate
              onClick={() => {
                document.querySelector('[data-section="contact"]')?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact
            </SpecularButton>
            <a href="/Resume-Aman.pdf" download className="resume-btn">
              Resume
            </a>
          </div>
        </div>

        <div className="system-board" data-reveal aria-label="Capability signal map">
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
        <div data-reveal><strong>~2 yrs</strong><span>production engineering</span></div>
        <div data-reveal><strong>30+</strong><span>organizations behind RBAC policies</span></div>
        <div data-reveal><strong>8</strong><span>dashboard tabs replacing static reporting</span></div>
      </section>

      <section className="journey" data-section="journey">
        <aside className="journey-intro" data-reveal>
          <p className="system-label">[ operational path ]</p>
          <h2>Where the systems sharpened.</h2>
          <p>
            From chemical engineering into software, the through-line is practical: model the process, inspect the failure, and ship the interface people can trust.
          </p>
          <div className="progress-scale">
            <span>foundation</span>
            <span className="progress-track">
              <span className="progress-fill" style={{ transform: `scaleX(${timelineProgress})` }} />
            </span>
            <span>now</span>
          </div>
        </aside>
        <div className="timeline" ref={timelineRef}>
          {experience.map((item) => (
            <article className="timeline-item" data-reveal key={item.company}>
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
        <div className="section-heading" data-reveal>
          <p className="system-label">[ selected proof ]</p>
          <h2>Projects built like operating systems, not portfolio tiles.</h2>
        </div>
        <div className="project-switcher" data-reveal role="tablist" aria-label="Project selector">
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
        <article className="project-stage" data-reveal>
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
        <div className="section-heading" data-reveal>
          <p className="system-label">[ toolkit ]</p>
          <h2>Comfortable at the layer where data, APIs, and users meet.</h2>
        </div>
        <div className="skill-matrix" data-reveal>
          {skillGroups.map(([label, ...items]) => (
            <div className="skill-group" key={label}>
              <strong>{label}</strong>
              {items.map((item) => <span key={item}>{item}</span>)}
            </div>
          ))}
        </div>
      </section>

      <section className="contact" data-section="contact">
        <p className="system-label" data-reveal>[ next system ]</p>
        <h2 data-reveal>Let's build something accountable together.</h2>
        <div className="contact-links" data-reveal>
          <a href="mailto:amanbilin13@gmail.com" className="contact-link">amanbilin13@gmail.com</a>
          <a href="https://github.com/aman-shabilin" className="contact-link" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/amanbilin" className="contact-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="tel:+6019-9648165" className="contact-link">+60 19-964 8165</a>
        </div>
      </section>
    </main>
  );
}
