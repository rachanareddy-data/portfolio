import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Download, ExternalLink, Mail, MapPin, Menu, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { AgentChat } from "./agent/AgentChat";

// ─── Data ──────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
];

type Project = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  tech: string[];
  result: { label: string; value: string } | null;
  github: string | null;
  demo: string | null;
};

const FEATURED_PROJECT: Project = {
  id: "mana-rythu",
  title: "Mana Rythu",
  problem:
    "Farmers in India lack direct market access and real-time agronomic guidance — forced to rely on middlemen for both pricing decisions and crop advice.",
  solution:
    "Full-stack platform with a GPT-4o AI agronomy assistant answering crop-specific questions in real time, and a WebSocket-driven marketplace connecting farmers directly with buyers.",
  tech: ["React", "Node.js", "PostgreSQL", "WebSockets", "GPT-4o"],
  result: null,
  github: "https://github.com/rachanareddy-data/mana-rythu",
  demo: "https://mana-rythu-ai.replit.app/",
};

const REST_PROJECTS: Project[] = [
  {
    id: "wheat-yield",
    title: "Wheat Yield Prediction",
    problem:
      "Unpredictable wheat yields make it difficult for farmers and agencies to plan inputs, logistics, and distribution effectively.",
    solution:
      "Random Forest regression model trained on environmental and soil features to forecast crop yield before the growing season ends.",
    tech: ["Python", "Scikit-learn", "Pandas", "Streamlit"],
    result: { label: "R²", value: "0.924" },
    github: "https://github.com/rachanareddy-data/wheat-yield-prediction",
    demo: "https://wheat-yield-prediction-jksxkuy86exsay2quhxq3p.streamlit.app/",
  },
  {
    id: "telecom-churn",
    title: "Telecom Churn Prediction",
    problem:
      "Telecom companies lose revenue when high-risk customers churn before any targeted retention effort can reach them.",
    solution:
      "PySpark MLlib classification pipeline processing large-scale distributed telecom datasets to identify churn risk early.",
    tech: ["PySpark", "MLlib", "Python"],
    result: { label: "AUC", value: "0.81" },
    github: null,
    demo: null,
  },
  {
    id: "loan-default",
    title: "Loan Default Prediction",
    problem:
      "Credit institutions incur significant losses from lending decisions made without reliable default risk signals.",
    solution:
      "Gradient Boosting classifier trained on applicant financial features to predict loan default probability and flag high-risk accounts.",
    tech: ["Python", "Gradient Boosting", "Scikit-learn"],
    result: { label: "Accuracy", value: "88%" },
    github: "https://github.com/rachanareddy-data/Loan-Default-Prediction-using-Machine-Learning-Predictive-Analytics-Financial-Risk-Modeling",
    demo: null,
  },
  {
    id: "maternal-health",
    title: "Maternal Health Risk",
    problem:
      "High-risk pregnancies often go undetected until complications arise, closing the window for early clinical intervention.",
    solution:
      "ML classification model that evaluates maternal health risk from clinical indicators, enabling proactive care decisions.",
    tech: ["Python", "Machine Learning"],
    result: { label: "Accuracy", value: "86%" },
    github: "https://github.com/rachanareddy-data/maternal-health-risk-prediction",
    demo: null,
  },
];

const SKILL_GROUPS = [
  { category: "Languages", skills: ["Python", "SQL", "JavaScript", "TypeScript"] },
  { category: "Web", skills: ["React", "Node.js", "Express", "PostgreSQL"] },
  {
    category: "ML & AI",
    skills: ["Scikit-learn", "PySpark", "MLlib", "Pandas", "NumPy", "GPT-4o API"],
  },
  { category: "Methods", skills: ["Feature Engineering", "ML Pipelines"] },
];

type CertGroup = {
  group: string;
  issuer: string;
  dotColor: string;
  textColor: string;
  borderColor: string;
  certs: { id: string; title: string; url: string }[];
};

const CERT_GROUPS: CertGroup[] = [
  {
    group: "AI",
    issuer: "Anthropic",
    dotColor: "bg-amber-400",
    textColor: "text-amber-400/70",
    borderColor: "border-l-amber-400/40",
    certs: [
      {
        id: "anthropic-1",
        title: "Anthropic AI Certificate (1)",
        url: "https://verify.skilljar.com/c/fiuf9f24hbsv",
      },
      {
        id: "anthropic-2",
        title: "Anthropic AI Certificate (2)",
        url: "https://verify.skilljar.com/c/oszs5ge34ppc",
      },
    ],
  },
  {
    group: "IBM",
    issuer: "IBM",
    dotColor: "bg-blue-400",
    textColor: "text-blue-400/70",
    borderColor: "border-l-blue-400/40",
    certs: [
      {
        id: "ibm-cert",
        title: "IBM Professional Certificate",
        url: "https://www.credly.com/badges/5f69f8cb-f61f-425a-b108-9d70fd4a40b8",
      },
    ],
  },
  {
    group: "NxtWave",
    issuer: "NxtWave",
    dotColor: "bg-violet-400",
    textColor: "text-violet-400/70",
    borderColor: "border-l-violet-400/40",
    certs: [
      {
        id: "nxt-dev",
        title: "Developer Foundations",
        url: "https://certificates.ccbp.in/intensive/developer-foundations?id=KXVKJYZEXT",
      },
      {
        id: "nxt-programming",
        title: "Programming Foundations",
        url: "https://certificates.ccbp.in/intensive/programming-foundations?id=WZMJGBXEKM",
      },
      {
        id: "nxt-js",
        title: "JavaScript Essentials",
        url: "https://certificates.ccbp.in/intensive/javascript-essentials?id=CLEKWTNZTB",
      },
      {
        id: "nxt-dynamic",
        title: "Dynamic Web Application",
        url: "https://certificates.ccbp.in/intensive/dynamic-web-application?id=KBMXRAPLC",
      },
      {
        id: "nxt-static",
        title: "Static Website",
        url: "https://certificates.ccbp.in/intensive/static-website?id=MDPIVPPNCL",
      },
      {
        id: "nxt-responsive",
        title: "Responsive Website",
        url: "https://certificates.ccbp.in/intensive/responsive-website?id=ASZOIADEKF",
      },
      {
        id: "nxt-flexbox",
        title: "Flexbox",
        url: "https://certificates.ccbp.in/intensive/flexbox?id=LCXOJJUUQH",
      },
      {
        id: "nxt-databases",
        title: "Introduction to Databases",
        url: "https://certificates.ccbp.in/intensive/introduction-to-databases?id=PPCVNCVFOJ",
      },
    ],
  },
];

// ─── Animation variants ────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
};

function stagger(delay = 0.09): Variants {
  return { show: { transition: { staggerChildren: delay } } };
}

// ─── Shared components ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] text-primary/60 mb-3">
      {children}
    </span>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <AgentChat />
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-20">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <CertificationsSection />
          <ContactSection />
        </main>
        <footer className="border-t border-white/[0.04] py-7 mt-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-mono text-muted-foreground/30">
              © {new Date().getFullYear()} Rachana Baddam
            </p>
            <p className="text-xs font-mono text-muted-foreground/20">
              Built with React · Vite · TypeScript
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.05] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-20 flex items-center justify-between">
        <a
          href="#"
          data-testid="link-logo"
          aria-label="Rachana Baddam — back to top"
          className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
        >
          <span className="font-mono text-primary/60 text-xs select-none" aria-hidden>
            &gt;_
          </span>
          <span>
            RB<span className="text-primary">.</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              data-testid={`link-nav-${link.name.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:text-white rounded"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          data-testid="button-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2.5 -mr-1 text-muted-foreground hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
        >
          {menuOpen ? (
            <X className="w-5 h-5" aria-hidden />
          ) : (
            <Menu className="w-5 h-5" aria-hidden />
          )}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/[0.05]"
          >
            <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  data-testid={`link-mobile-nav-${link.name.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-muted-foreground hover:text-white transition-colors py-2.5 border-b border-white/[0.04] last:border-0"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function HeroSection() {
  const { toast } = useToast();

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex flex-col justify-center min-h-[92vh] sm:min-h-[96vh] pt-24 pb-16 sm:pb-20 overflow-hidden"
    >
      {/* ── Background ambience ── */}
      {/* Large cyan glow — upper left, bleeds off canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] -left-[20%] w-[70vw] h-[70vw] max-w-[680px] max-h-[680px]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(195 85% 52% / 0.13) 0%, transparent 68%)",
        }}
      />
      {/* Smaller indigo accent — right side, mid-height */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[30%] -right-[8%] w-[40vw] h-[40vw] max-w-[380px] max-h-[380px]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(225 75% 58% / 0.09) 0%, transparent 70%)",
        }}
      />
      {/* Bottom fade — guides eye toward next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(222 20% 5% / 0.6))",
        }}
      />

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 max-w-4xl"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
        }}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow badge */}
        <motion.div variants={fadeIn} className="mb-8">
          <span
            data-testid="badge-hero-education"
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] font-mono tracking-[0.12em] text-muted-foreground"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
              aria-hidden
            />
            MS Data Science · Saint Peter's University
          </span>
        </motion.div>

        {/* Name — the primary headline, massive */}
        <motion.h1
          variants={fadeUp}
          data-testid="text-hero-name"
          className="font-extrabold tracking-[-0.035em] leading-[0.96] mb-7"
          style={{ fontSize: "clamp(3.6rem, 10.5vw, 7.5rem)" }}
        >
          Rachana
          <br />
          <span className="text-white/90">Baddam</span>
        </motion.h1>

        {/* Value proposition — gradient, tells exactly what she builds */}
        <motion.p
          variants={fadeUp}
          data-testid="text-hero-tagline"
          className="text-gradient font-semibold tracking-[-0.01em] leading-tight mb-6"
          style={{ fontSize: "clamp(1.45rem, 3.6vw, 2.35rem)" }}
        >
          Building AI systems that ship.
        </motion.p>

        {/* Role line — compact, single row, very muted */}
        <motion.p
          variants={fadeUp}
          data-testid="text-hero-title"
          className="text-sm tracking-[0.06em] text-muted-foreground/50 uppercase font-mono mb-8 sm:mb-12"
        >
          Data Scientist&ensp;&middot;&ensp;ML Engineer&ensp;&middot;&ensp;AI Product Builder
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
          <a
            href="#projects"
            data-testid="button-view-projects"
            className="inline-flex items-center justify-center gap-2 h-12 sm:h-11 px-7 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all hover:bg-primary/85 hover:-translate-y-px hover:shadow-[0_0_28px_hsl(195_85%_52%/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View Projects
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </a>
          <button
            onClick={() =>
              toast({
                title: "Resume coming soon",
                description: "Currently updating it. Check back shortly.",
              })
            }
            type="button"
            data-testid="button-download-resume"
            className="inline-flex items-center justify-center gap-2 h-12 sm:h-11 px-7 rounded-lg border border-white/[0.09] text-sm font-semibold text-muted-foreground transition-all hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <Download className="w-3.5 h-3.5" aria-hidden />
            Resume
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── About ─────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 py-20 md:py-28">
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-5 gap-12 md:gap-16 items-start"
      >
        <div className="md:col-span-3 space-y-6">
          <motion.div variants={fadeIn}>
            <SectionLabel>Background</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            id="about-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]"
          >
            Rigorous engineering,{" "}
            <span className="text-gradient">startup execution.</span>
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="space-y-4 text-muted-foreground leading-[1.75]"
          >
            <p data-testid="text-about-intro">
              M.S. Data Science graduate from Saint Peter's University (GPA 3.68, May 2026).
              I build real ML systems — deployed, working, production-grade — using Python, PySpark,
              and GPT-4o alongside modern AI development tools.
            </p>
            <p data-testid="text-about-focus">
              My advantage is execution speed. I move quickly from problem to deployed system,
              prioritizing tangible outcomes. I thrive in high-velocity environments where the
              ability to ship matters more than years on a resume.
            </p>
          </motion.div>
        </div>

        <motion.div variants={fadeRight} className="md:col-span-2">
          <dl className="glass-card-elevated rounded-2xl divide-y divide-white/[0.05] overflow-hidden">
            {[
              { label: "Degree", value: "MS Data Science" },
              { label: "University", value: "Saint Peter's University" },
              { label: "Graduate", value: "May 2026" },
              { label: "GPA", value: "3.68 / 4.0", highlight: true },
              { label: "Focus", value: "Applied AI & ML Systems" },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex justify-between items-center px-5 py-3.5">
                <dt className="text-xs text-muted-foreground/60 uppercase tracking-wider font-mono">
                  {label}
                </dt>
                <dd
                  className={`text-sm font-medium text-right ${
                    highlight ? "text-primary" : "text-white/90"
                  }`}
                  data-testid={`text-about-${label.toLowerCase()}`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Projects ──────────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-24 py-20 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger(0.1)}
        className="space-y-10"
      >
        <div>
          <motion.div variants={fadeIn}>
            <SectionLabel>Work</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            id="projects-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Selected Projects
          </motion.h2>
        </div>

        {/* Featured project — full width, more visual weight */}
        <motion.div variants={fadeUp}>
          <FeaturedProjectCard />
        </motion.div>

        {/* Supporting projects — 2×2 grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {REST_PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ── Shared case-study block ────────────────────────────────────────────────
function CaseBlock({ label, text, testId }: { label: string; text: string; testId?: string }) {
  return (
    <div className="space-y-1.5">
      <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-primary/50">
        {label}
      </span>
      <p data-testid={testId} className="text-sm text-muted-foreground leading-relaxed">
        {text}
      </p>
    </div>
  );
}

// ── Tech pill ──────────────────────────────────────────────────────────────
function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-block text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-muted-foreground/75 border border-white/[0.06]">
      {label}
    </span>
  );
}

// ── Featured card ──────────────────────────────────────────────────────────
function FeaturedProjectCard() {
  const p = FEATURED_PROJECT;
  return (
    <motion.article
      data-testid={`card-project-${p.id}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease }}
      className="relative overflow-hidden glass-card-elevated rounded-2xl border-l-[3px] border-l-primary/50 group"
    >
      {/* Subtle inner glow that surfaces on hover */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, hsl(195 85% 52% / 0.07) 0%, transparent 55%)",
        }}
      />

      <div className="relative p-7 md:p-10 space-y-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <SectionLabel>Featured Project</SectionLabel>
            <h3
              data-testid={`text-project-title-${p.id}`}
              className="text-2xl md:text-[1.85rem] font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300"
            >
              {p.title}
            </h3>
          </div>
          {/* CTA buttons — top-right on desktop, full-width row on mobile */}
          <div className="flex flex-wrap gap-2.5 w-full sm:w-auto sm:shrink-0">
            <a
              href={p.demo!}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-project-demo-${p.id}`}
              aria-label={`Open ${p.title} live demo`}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 h-10 sm:h-9 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/85 hover:-translate-y-px transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ExternalLink className="w-3 h-3" aria-hidden />
              Live Demo
            </a>
            <a
              href={p.github!}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-project-github-${p.id}`}
              aria-label={`View ${p.title} source on GitHub`}
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 h-10 sm:h-9 px-5 rounded-lg border border-white/[0.1] text-xs font-semibold text-muted-foreground hover:text-white hover:border-white/[0.2] hover:bg-white/[0.04] hover:-translate-y-px transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <SiGithub className="w-3 h-3" aria-hidden />
              GitHub
            </a>
          </div>
        </div>

        {/* Problem / Solution — side by side on md+ */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="space-y-1.5">
            <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-rose-400/60">
              Problem
            </span>
            <p
              data-testid={`text-project-problem-${p.id}`}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {p.problem}
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-primary/50">
              Solution
            </span>
            <p
              data-testid={`text-project-solution-${p.id}`}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {p.solution}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="space-y-2.5">
          <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/40">
            Tech Stack
          </span>
          <div className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <TechPill key={t} label={t} />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ── Regular project card ───────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const hasLinks = project.github || project.demo;

  return (
    <motion.article
      data-testid={`card-project-${project.id}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.28, ease }}
      className="relative overflow-hidden glass-card-elevated rounded-xl flex flex-col group hover:border-primary/20 transition-colors duration-300"
    >
      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, hsl(195 85% 52% / 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex flex-col flex-1 p-6 space-y-5">
        {/* Header: title + metric */}
        <div className="flex items-start justify-between gap-3">
          <h3
            data-testid={`text-project-title-${project.id}`}
            className="text-base font-semibold text-white group-hover:text-primary transition-colors duration-300 leading-snug"
          >
            {project.title}
          </h3>
          {project.result && (
            <div className="shrink-0 text-right leading-none">
              <span className="block text-[1.1rem] font-mono font-bold text-primary tabular-nums">
                {project.result.value}
              </span>
              <span className="block text-[9px] font-mono text-muted-foreground/45 uppercase tracking-widest mt-0.5">
                {project.result.label}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.05]" />

        {/* Problem */}
        <CaseBlock
          label="Problem"
          text={project.problem}
          testId={`text-project-problem-${project.id}`}
        />

        {/* Solution */}
        <CaseBlock
          label="Solution"
          text={project.solution}
          testId={`text-project-solution-${project.id}`}
        />

        {/* Tech stack */}
        <div className="space-y-2 pt-1">
          <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/40">
            Stack
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <TechPill key={t} label={t} />
            ))}
          </div>
        </div>

        {/* Links */}
        {hasLinks && (
          <div className="mt-auto pt-4 border-t border-white/[0.05] flex flex-wrap items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-project-github-${project.id}`}
                aria-label={`Source code for ${project.title} on GitHub`}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-xs font-semibold text-muted-foreground/70 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.05] transition-all"
              >
                <SiGithub className="w-3.5 h-3.5" aria-hidden />
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-project-demo-${project.id}`}
                aria-label={`Live demo for ${project.title}`}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-primary/20 bg-primary/[0.04] text-xs font-semibold text-primary/70 hover:text-primary hover:border-primary/40 hover:bg-primary/[0.08] transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ─── Skills ────────────────────────────────────────────────────────────────

function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-24 py-20 md:py-28">
      <motion.div
        variants={stagger(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12"
      >
        <div>
          <motion.div variants={fadeIn}>
            <SectionLabel>Capabilities</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            id="skills-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Technical Skills
          </motion.h2>
        </div>

        <motion.div variants={stagger(0.08)} className="grid sm:grid-cols-2 gap-x-12 gap-y-8 md:gap-x-16 md:gap-y-10">
          {SKILL_GROUPS.map((group) => (
            <motion.div key={group.category} variants={fadeUp} className="space-y-3">
              <h3 className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/50">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    data-testid={`badge-skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                    className="px-3 py-1.5 rounded-lg glass-card text-sm text-white/75 hover:text-white hover:border-primary/20 transition-colors duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Certifications ────────────────────────────────────────────────────────

// ── Verification card ──────────────────────────────────────────────────────
function CertCard({
  cert,
  issuer,
  dotColor,
  textColor,
  borderColor,
}: {
  cert: { id: string; title: string; url: string };
  issuer: string;
  dotColor: string;
  textColor: string;
  borderColor: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease }}
      className={`relative overflow-hidden glass-card-elevated rounded-xl border-l-2 ${borderColor} p-5 flex flex-col gap-3.5 group`}
    >
      {/* Hover ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, hsl(195 85% 52% / 0.05) 0%, transparent 65%)",
        }}
      />

      {/* Issuer badge */}
      <div className={`relative flex items-center gap-2 ${textColor}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} aria-hidden />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{issuer}</span>
      </div>

      {/* Certificate name */}
      <p className="relative text-sm font-semibold text-white/85 leading-snug flex-1 group-hover:text-white transition-colors duration-200">
        {cert.title}
      </p>

      {/* Verify action */}
      <a
        href={cert.url}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`link-cert-${cert.id}`}
        aria-label={`Verify ${cert.title} certificate from ${issuer}`}
        className="relative inline-flex items-center gap-1.5 h-7 px-3 rounded-md border border-white/[0.08] bg-white/[0.02] text-[11px] font-semibold text-muted-foreground/55 hover:text-white hover:border-primary/35 hover:bg-primary/[0.06] transition-all self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <ExternalLink className="w-3 h-3" aria-hidden />
        Verify
      </a>
    </motion.div>
  );
}

// ── Certifications section ─────────────────────────────────────────────────
function CertificationsSection() {
  return (
    <section
      id="certifications"
      aria-labelledby="certs-heading"
      className="scroll-mt-24 py-20 md:py-28"
    >
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-14"
      >
        {/* Heading */}
        <div>
          <motion.div variants={fadeIn}>
            <SectionLabel>Credentials</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            id="certs-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Certifications
          </motion.h2>
        </div>

        {/* Groups */}
        <div className="space-y-12">
          {CERT_GROUPS.map((group, groupIdx) => (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: groupIdx * 0.1, ease }}
            >
              {/* Group header — inline rule */}
              <div className="flex items-center gap-4 mb-5">
                <span
                  className={`text-[10px] font-mono uppercase tracking-[0.22em] ${group.textColor} shrink-0`}
                >
                  {group.group}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[10px] font-mono text-muted-foreground/30 shrink-0">
                  {group.certs.length}{" "}
                  {group.certs.length === 1 ? "certificate" : "certificates"}
                </span>
              </div>

              {/* Card grid — density adapts per group */}
              <div
                className={`grid gap-3 ${
                  group.group === "NxtWave"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
                    : "sm:grid-cols-2"
                }`}
              >
                {group.certs.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease }}
                  >
                    <CertCard
                      cert={cert}
                      issuer={group.issuer}
                      dotColor={group.dotColor}
                      textColor={group.textColor}
                      borderColor={group.borderColor}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─── Contact ───────────────────────────────────────────────────────────────

function ContactSection() {
  const { toast } = useToast();

  const links: {
    id: string;
    label: string;
    value: string;
    href: string | null;
    icon: React.ReactNode;
    external: boolean;
    ariaLabel?: string;
  }[] = [
    {
      id: "email",
      label: "Email",
      value: "rachana.reddy.ds@gmail.com",
      href: "mailto:rachana.reddy.ds@gmail.com",
      icon: <Mail className="w-4 h-4" aria-hidden />,
      external: false,
      ariaLabel: "Send email to rachana.reddy.ds@gmail.com",
    },
    {
      id: "github",
      label: "GitHub",
      value: "github.com/rachanareddy-data",
      href: "https://github.com/rachanareddy-data",
      icon: <SiGithub className="w-4 h-4" aria-hidden />,
      external: true,
      ariaLabel: "GitHub profile",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "linkedin.com/in/rachana-baddam",
      href: "https://www.linkedin.com/in/rachana-baddam",
      icon: <FaLinkedin className="w-4 h-4" aria-hidden />,
      external: true,
      ariaLabel: "LinkedIn profile",
    },
    {
      id: "location",
      label: "Location",
      value: "New Jersey, USA",
      href: null,
      icon: <MapPin className="w-4 h-4" aria-hidden />,
      external: false,
    },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 py-20 md:py-28 pb-14 md:pb-24 border-t border-white/[0.05]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left — heading + cta */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-7"
        >
          <div>
            <motion.div variants={fadeIn}>
              <SectionLabel>Get in touch</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              id="contact-heading"
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              Let's build something.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-muted-foreground leading-relaxed"
            >
              Open to the right opportunities — roles, collaborations, and
              interesting problems. Reach out directly.
            </motion.p>
          </div>

          {/* Resume download */}
          <motion.div variants={fadeUp}>
            <button
              onClick={() =>
                toast({
                  title: "Resume coming soon",
                  description: "Currently updating it. Check back shortly.",
                })
              }
              type="button"
              data-testid="button-download-resume-contact"
              aria-label="Download resume"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 h-11 px-6 rounded-lg border border-white/[0.09] bg-white/[0.02] text-sm font-semibold text-muted-foreground hover:text-white hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <Download className="w-3.5 h-3.5" aria-hidden />
              Download Resume
            </button>
          </motion.div>
        </motion.div>

        {/* Right — contact rows */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-2.5"
        >
          {links.map((link) => {
            const inner = (
              <>
                {/* Icon box */}
                <div className="w-10 h-10 rounded-lg border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-primary/50 group-hover:text-primary group-hover:border-primary/25 group-hover:bg-primary/[0.06] transition-all duration-200 shrink-0">
                  {link.icon}
                </div>
                {/* Label + value */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/40 mb-0.5">
                    {link.label}
                  </p>
                  <p className="text-sm font-medium text-white/75 group-hover:text-white transition-colors duration-200 break-words min-w-0">
                    {link.value}
                  </p>
                </div>
                {/* Arrow — only for clickable links */}
                {link.href && (
                  <ExternalLink
                    className="w-3.5 h-3.5 text-muted-foreground/25 group-hover:text-primary/60 transition-colors duration-200 shrink-0"
                    aria-hidden
                  />
                )}
              </>
            );

            const sharedClass =
              "group flex items-center gap-3 p-4 glass-card-elevated rounded-xl transition-colors duration-200 w-full min-w-0 overflow-hidden";

            return (
              <motion.div
                key={link.id}
                variants={fadeUp}
              >
                {link.href ? (
                  <motion.a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    data-testid={`link-contact-${link.id}`}
                    aria-label={link.ariaLabel ?? link.value}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2, ease }}
                    className={`${sharedClass} hover:border-primary/20 cursor-pointer`}
                  >
                    {inner}
                  </motion.a>
                ) : (
                  <div className={sharedClass} aria-label={link.label}>
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
