import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, RotateCcw, ExternalLink, GraduationCap, Mail, Linkedin, Github, MapPin } from "lucide-react";
import {
  PROFILE, EDUCATION, PROJECTS, SKILL_GROUPS, CERTS, CONTACT,
  type KBProject,
} from "./knowledge";

// ─── Types ──────────────────────────────────────────────────────────────────

type TextPart      = { type: "text"; content: string };
type ProjectPart   = { type: "project"; id: string };
type ProjectsPart  = { type: "projects"; ids: string[] };
type SkillsPart    = { type: "skills" };
type CertsPart     = { type: "certs" };
type ContactPart   = { type: "contact" };
type EducationPart = { type: "education" };

type ResponsePart = TextPart | ProjectPart | ProjectsPart | SkillsPart | CertsPart | ContactPart | EducationPart;

interface AgentResponse {
  parts: ResponsePart[];
  suggestions: string[];
}

interface UserMsg  { id: string; role: "user"; text: string }
interface AgentMsg { id: string; role: "agent"; parts: ResponsePart[]; suggestions: string[] }
type ChatMessage = UserMsg | AgentMsg;

// ─── Engine ─────────────────────────────────────────────────────────────────

function has(q: string, ...terms: string[]): boolean {
  return terms.some((t) => q.includes(t));
}

function projectResponse(id: string, suggestions: string[]): AgentResponse {
  return { parts: [{ type: "project", id }], suggestions };
}

function domainProjects(tag: string, label: string): AgentResponse {
  const ids = PROJECTS.filter((p) => p.tags.includes(tag)).map((p) => p.id);
  return {
    parts: [
      { type: "text", content: `Here are Rachana's **${label}** projects:` },
      { type: "projects", ids },
    ],
    suggestions: ["Show all projects", "What are her skills?", "Tell me about Mana Rythu"],
  };
}

function getResponse(input: string): AgentResponse {
  const q = input.toLowerCase().trim();

  // ── Greetings ──────────────────────────────────────────────────────────
  if (has(q, "hi", "hello", "hey", "howdy", "sup", "greetings", "good morning", "good afternoon")) {
    return {
      parts: [{ type: "text", content: "Hi there! 👋 I'm Rachana's AI portfolio agent — I know everything about her background, projects, skills, and experience.\n\nWhat would you like to know?" }],
      suggestions: ["Who is Rachana?", "Show her projects", "What are her skills?", "Why hire her?"],
    };
  }

  // ── Specific projects (highest priority) ───────────────────────────────
  if (has(q, "mana rythu", "mana-rythu", "agricultural platform", "farmer marketplace", "crop advisor", "your flagship", "best project", "strongest project", "what did you personally build", "what have you built", "founder")) {
    return projectResponse("mana-rythu", ["What tech is used in Mana Rythu?", "Show all projects", "Contact Rachana"]);
  }

  if (has(q, "wheat", "yield prediction", "streamlit project")) {
    return projectResponse("wheat-yield", ["Show agriculture projects", "What ML models?", "Show all projects"]);
  }

  if (has(q, "churn", "telecom", "pyspark project")) {
    return projectResponse("telecom-churn", ["Show all projects", "What ML models?", "What is PySpark?"]);
  }

  if (has(q, "loan", "default prediction", "financial risk", "credit risk")) {
    return projectResponse("loan-default", ["Show finance projects", "What ML models?", "Show all projects"]);
  }

  if (has(q, "maternal", "pregnancy", "maternal health")) {
    return projectResponse("maternal-health", ["Show healthcare projects", "What ML models?", "Show all projects"]);
  }

  if (has(q, "fao", "food security", "fao analysis", "fao agriculture")) {
    return projectResponse("fao-analysis", ["Show agriculture projects", "Show all projects", "What's her tech stack?"]);
  }

  // ── Domain-based project queries ───────────────────────────────────────
  if (has(q, "healthcare project", "health project", "medical project", "clinical project")) {
    return domainProjects("healthcare", "healthcare");
  }

  if (has(q, "finance project", "financial project", "banking project")) {
    return domainProjects("finance", "finance");
  }

  if (has(q, "agriculture project", "farming project", "agri project", "crop project")) {
    return domainProjects("agriculture", "agriculture");
  }

  if (has(q, "machine learning project", "ml project", "ai project", "prediction project", "deep learning project")) {
    return domainProjects("ml", "machine learning");
  }

  if (has(q, "big data project", "spark project", "distributed")) {
    return domainProjects("big-data", "big data");
  }

  // ── All projects ───────────────────────────────────────────────────────
  if (has(q, "all project", "show project", "list project", "what project", "projects", "portfolio work", "your work", "what have you done")) {
    return {
      parts: [
        { type: "text", content: "Here are all of Rachana's projects:" },
        { type: "projects", ids: PROJECTS.map((p) => p.id) },
      ],
      suggestions: ["Tell me about Mana Rythu", "What are her skills?", "Contact Rachana"],
    };
  }

  // ── Tech / Skills ──────────────────────────────────────────────────────
  if (has(q, "pyspark", "spark mllib", "spark")) {
    return {
      parts: [{ type: "text", content: "Rachana uses **PySpark** and **Spark MLlib** for large-scale distributed machine learning. She applied these in the Telecom Churn Prediction project, processing large datasets across distributed nodes to achieve AUC 0.81." }],
      suggestions: ["Tell me about Telecom Churn", "Show all ML projects", "What other tools?"],
    };
  }

  if (has(q, "gpt-4", "gpt4", "openai", "llm", "language model", "chatgpt")) {
    return {
      parts: [{ type: "text", content: "Rachana integrated **GPT-4o** into Mana Rythu — her AI agricultural platform. The GPT-4o Crop Advisor gives real-time, context-aware crop recommendations to farmers based on location and conditions.\n\nThis is one of the few portfolio projects where GPT-4o is wired into a real production product with a live user base." }],
      suggestions: ["Tell me about Mana Rythu", "Show all projects", "What other AI skills?"],
    };
  }

  if (has(q, "random forest")) {
    return {
      parts: [{ type: "text", content: "**Random Forest** is Rachana's go-to algorithm for both classification and regression. She's applied it in:\n\n**Wheat Yield Prediction** — R² = 0.924\n**Telecom Churn** — AUC = 0.81\n**Loan Default** — 88% accuracy\n\nShe chooses it for robustness with mixed-type features, resistance to overfitting, and built-in feature importance." }],
      suggestions: ["Show wheat yield project", "Show all ML projects", "What other models?"],
    };
  }

  if (has(q, "gradient boosting", "xgboost")) {
    return {
      parts: [{ type: "text", content: "Rachana used **Gradient Boosting** in the Loan Default Prediction project, combined with SMOTE to handle class imbalance in the financial dataset. The result: 88% accuracy on a difficult imbalanced problem." }],
      suggestions: ["Tell me about Loan Default", "What is SMOTE?", "Show all projects"],
    };
  }

  if (has(q, "smote", "class imbalance", "imbalanced")) {
    return {
      parts: [{ type: "text", content: "**SMOTE** (Synthetic Minority Over-sampling Technique) is a technique Rachana used in the Loan Default Prediction project to handle severe class imbalance — where defaulters are rare. SMOTE generates synthetic minority-class samples to give the model a balanced view of both outcomes." }],
      suggestions: ["Tell me about Loan Default", "Show finance projects", "What ML models?"],
    };
  }

  if (has(q, "python")) {
    return {
      parts: [{ type: "text", content: "**Python** is Rachana's primary language — she uses it across the full ML stack: data engineering with Pandas/NumPy, modeling with Scikit-learn and PySpark, and deployment with Streamlit. All 5 of her ML projects are Python-based." }],
      suggestions: ["Show ML projects", "What other skills?", "Show all projects"],
    };
  }

  if (has(q, "react", "frontend", "front-end", "javascript", "typescript")) {
    return {
      parts: [{ type: "text", content: "Rachana is proficient in **React** and **TypeScript**, which she used extensively in Mana Rythu — her full-stack AI agricultural platform. She also built this portfolio in React + Vite + TypeScript + Tailwind CSS." }],
      suggestions: ["Tell me about Mana Rythu", "What other skills?", "Show all projects"],
    };
  }

  if (has(q, "postgresql", "database", "sql")) {
    return {
      parts: [{ type: "text", content: "Rachana has production experience with **PostgreSQL**, which powers the database layer of Mana Rythu — handling user auth, crop listings, marketplace transactions, and messaging. She also has coursework in database design and SQL." }],
      suggestions: ["Tell me about Mana Rythu", "What other skills?", "Show all projects"],
    };
  }

  if (has(q, "streamlit")) {
    return {
      parts: [{ type: "text", content: "Rachana uses **Streamlit** to deploy ML models as interactive web apps. Her Wheat Yield Prediction model is live as a Streamlit app, letting users explore predictions interactively." }],
      suggestions: ["Show Wheat Yield project", "Show all projects", "What other tools?"],
    };
  }

  if (has(q, "skill", "technolog", "tech stack", "what do you know", "what can", "experience with", "languages", "frameworks", "tools", "stack", "capabilities")) {
    return {
      parts: [
        { type: "text", content: "Here's Rachana's technical skill set:" },
        { type: "skills" },
      ],
      suggestions: ["Show her projects", "What's her best project?", "Contact Rachana"],
    };
  }

  // ── Education ──────────────────────────────────────────────────────────
  if (has(q, "education", "degree", "gpa", "grade", "university", "school", "study", "coursework", "graduation", "academic", "master", "ms ", "m.s")) {
    return {
      parts: [{ type: "education" }],
      suggestions: ["What projects did she build?", "What are her skills?", "Why hire Rachana?"],
    };
  }

  // ── Certifications ─────────────────────────────────────────────────────
  if (has(q, "certification", "certificate", "certified", "ibm", "nxtwave", "credential", "anthropic cert", "claude cert")) {
    return {
      parts: [
        { type: "text", content: `Rachana holds **${CERTS.length} certifications** across AI, design thinking, and web engineering:` },
        { type: "certs" },
      ],
      suggestions: ["What are her skills?", "Show all projects", "Contact Rachana"],
    };
  }

  // ── Contact ────────────────────────────────────────────────────────────
  if (has(q, "contact", "email", "reach out", "get in touch", "linkedin", "connect with", "how to reach", "message")) {
    return {
      parts: [
        { type: "text", content: "Here's how to reach Rachana:" },
        { type: "contact" },
      ],
      suggestions: ["Show her projects", "Why hire Rachana?", "What are her skills?"],
    };
  }

  // ── GitHub ─────────────────────────────────────────────────────────────
  if (has(q, "github", "repository", "source code", "repo", "open source", "code")) {
    return {
      parts: [{
        type: "text",
        content: `Rachana's GitHub profile is **github.com/rachanareddy-data**.\n\nHer public repositories include:\n• **Mana Rythu** — AI agricultural platform\n• **Wheat Yield Prediction** — ML + Streamlit\n• **Loan Default Prediction** — Financial ML\n• **Maternal Health Risk** — Healthcare ML\n• **FAO Agriculture Analysis** — Data analysis`,
      }],
      suggestions: ["Show all projects", "Tell me about Mana Rythu", "Contact Rachana"],
    };
  }

  // ── Resume ─────────────────────────────────────────────────────────────
  if (has(q, "resume", "cv", "curriculum vitae", "download resume")) {
    return {
      parts: [{
        type: "text",
        content: "Rachana's resume is currently being updated. Please reach out directly:\n\n**Email:** rachana.reddy.ds@gmail.com\n**LinkedIn:** linkedin.com/in/rachana-baddam",
      }],
      suggestions: ["Contact Rachana", "Show her projects", "What are her skills?"],
    };
  }

  // ── Why hire ───────────────────────────────────────────────────────────
  if (has(q, "why hire", "why should", "should we hire", "should i hire", "what makes", "what sets", "competitive", "strength", "value", "recommend", "hire rachana")) {
    return {
      parts: [{
        type: "text",
        content: "Rachana brings a rare combination of full-stack engineering and applied data science — she doesn't just build models, she ships products.\n\n**Production AI:** Mana Rythu is a live AI platform she designed and built from zero — GPT-4o, real-time marketplace, PostgreSQL, WebSockets, full-stack TypeScript.\n\n**Strong ML record:** 5 ML projects spanning healthcare, finance, agriculture, and telecom with metrics that matter: R² 0.924, 88% accuracy, AUC 0.81.\n\n**Full-stack capable:** Python · React · TypeScript · PostgreSQL · Node.js · PySpark — she owns the entire stack.\n\n**Academic excellence:** M.S. Data Science, GPA 3.68, Saint Peter's University.",
      }],
      suggestions: ["Show her projects", "Contact Rachana", "What are her skills?"],
    };
  }

  // ── About / Who ────────────────────────────────────────────────────────
  if (has(q, "who is", "about rachana", "tell me about", "introduce", "background", "summary", "overview", "rachana baddam", "who are you", "about you")) {
    return {
      parts: [
        { type: "text", content: `**${PROFILE.name}** is a Data Scientist and ML Engineer based in ${PROFILE.location}.` },
        { type: "education" },
        { type: "text", content: PROFILE.summary },
      ],
      suggestions: ["Show her projects", "What are her skills?", "Why hire Rachana?", "Contact her"],
    };
  }

  // ── Fallback ───────────────────────────────────────────────────────────
  return {
    parts: [{
      type: "text",
      content: "I don't have information about that in Rachana's portfolio. Try asking about her projects, skills, education, certifications, or how to contact her.",
    }],
    suggestions: ["Who is Rachana?", "Show her projects", "What are her skills?", "Contact Rachana"],
  };
}

// ─── Render helpers ─────────────────────────────────────────────────────────

function TextContent({ content }: { content: string }) {
  const paragraphs = content.split("\n\n");
  return (
    <div className="space-y-2">
      {paragraphs.map((para, i) => {
        const parts = para.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-sm text-white/80 leading-relaxed">
            {parts.map((chunk, j) =>
              j % 2 === 1
                ? <strong key={j} className="text-white font-semibold">{chunk}</strong>
                : chunk.split("\n").map((line, k, arr) => (
                    <span key={k}>{line}{k < arr.length - 1 && <br />}</span>
                  ))
            )}
          </p>
        );
      })}
    </div>
  );
}

function AgentProjectCard({ project }: { project: KBProject }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3 hover:border-white/[0.14] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-primary/60 mb-0.5">{project.domain}</p>
          <h4 className="text-sm font-semibold text-white leading-snug">{project.title}</h4>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5">{project.role}</p>
        </div>
        {project.metric && (
          <div className="text-right shrink-0">
            <p className="text-[10px] font-mono text-muted-foreground/40 uppercase">{project.metric.label}</p>
            <p className="text-base font-bold text-primary leading-none mt-0.5">{project.metric.value}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground/60 leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1">
        {project.tech.slice(0, 5).map((t) => (
          <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-muted-foreground/55 border border-white/[0.05]">
            {t}
          </span>
        ))}
        {project.tech.length > 5 && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-muted-foreground/40">
            +{project.tech.length - 5}
          </span>
        )}
      </div>

      {(project.github || project.demo) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-7 px-3 text-[11px] font-semibold rounded-lg border border-white/[0.09] text-muted-foreground/70 hover:text-white hover:border-white/[0.18] transition-colors"
            >
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-7 px-3 text-[11px] font-semibold rounded-lg border border-primary/25 text-primary/70 hover:text-primary hover:border-primary/50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" aria-hidden />
              Live Demo
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function AgentSkillsCard() {
  return (
    <div className="space-y-3">
      {SKILL_GROUPS.map((group) => (
        <div key={group.category}>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/40 mb-1.5">{group.category}</p>
          <div className="flex flex-wrap gap-1.5">
            {group.skills.map((s) => (
              <span key={s} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/65">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentCertsCard() {
  return (
    <div className="space-y-2">
      {CERTS.map((cert) => (
        <div key={cert.id} className="flex items-center justify-between gap-3 py-2 border-b border-white/[0.04] last:border-0">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-white/80 leading-snug">{cert.title}</p>
            <p className="text-[10px] font-mono text-muted-foreground/40 mt-0.5">{cert.issuer}</p>
          </div>
          {cert.verify && (
            <a
              href={cert.verify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold shrink-0 text-primary/60 hover:text-primary transition-colors"
            >
              Verify ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function AgentContactCard() {
  const rows = [
    { icon: <Mail className="w-4 h-4" />, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", value: "rachana-baddam", href: CONTACT.linkedin },
    { icon: <Github className="w-4 h-4" />, label: "GitHub", value: "rachanareddy-data", href: CONTACT.github },
    { icon: <MapPin className="w-4 h-4" />, label: "Location", value: CONTACT.location, href: null },
  ];
  return (
    <div className="space-y-2">
      {rows.map((row) =>
        row.href ? (
          <a
            key={row.label}
            href={row.href}
            target={row.href.startsWith("http") ? "_blank" : undefined}
            rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/25 hover:bg-primary/[0.04] transition-colors group"
          >
            <span className="text-primary/50 group-hover:text-primary transition-colors">{row.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40">{row.label}</p>
              <p className="text-xs font-medium text-white/75 group-hover:text-white transition-colors break-all">{row.value}</p>
            </div>
          </a>
        ) : (
          <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <span className="text-muted-foreground/30">{row.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40">{row.label}</p>
              <p className="text-xs font-medium text-white/70">{row.value}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function AgentEducationCard() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg border border-primary/20 bg-primary/[0.08] flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-primary/70" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{EDUCATION.degree}</p>
          <p className="text-xs text-muted-foreground/60">{EDUCATION.school}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-mono text-primary/70">GPA {EDUCATION.gpa}</span>
            <span className="text-[10px] text-muted-foreground/40">{EDUCATION.graduated}</span>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Coursework</p>
        <div className="flex flex-wrap gap-1.5">
          {EDUCATION.coursework.map((c) => (
            <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-muted-foreground/55">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RenderPart({ part }: { part: ResponsePart }) {
  switch (part.type) {
    case "text":
      return <TextContent content={part.content} />;
    case "project": {
      const p = PROJECTS.find((x) => x.id === part.id);
      return p ? <AgentProjectCard project={p} /> : null;
    }
    case "projects":
      return (
        <div className="space-y-2">
          {part.ids.map((id) => {
            const p = PROJECTS.find((x) => x.id === id);
            return p ? <AgentProjectCard key={id} project={p} /> : null;
          })}
        </div>
      );
    case "skills":
      return <AgentSkillsCard />;
    case "certs":
      return <AgentCertsCard />;
    case "contact":
      return <AgentContactCard />;
    case "education":
      return <AgentEducationCard />;
    default:
      return null;
  }
}

// ─── Typing indicator ────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/50"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const WELCOME: AgentMsg = {
  id: "welcome",
  role: "agent",
  parts: [{ type: "text", content: "👋 Hi! I'm Rachana's AI portfolio agent. I know everything about her background, projects, skills, and experience.\n\nWhat would you like to know?" }],
  suggestions: ["Who is Rachana?", "Show her projects", "What are her skills?", "Why hire her?"],
};

export function AgentChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 650 + Math.random() * 350;
    setTimeout(() => {
      const response = getResponse(trimmed);
      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "agent",
        parts: response.parts,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, agentMsg]);
      setTyping(false);
    }, delay);
  }, [typing]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function clearChat() {
    setMessages([WELCOME]);
    setInput("");
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-background/80 backdrop-blur-md border border-white/[0.08] rounded-full px-3.5 py-1.5 pointer-events-none"
            >
              <p className="text-xs font-semibold text-white/60 whitespace-nowrap">Ask my AI agent</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close AI agent" : "Open AI agent"}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{ background: "linear-gradient(135deg, hsl(195 85% 42%), hsl(200 90% 55%))" }}
        >
          {!open && (
            <span className="absolute inset-0 rounded-full animate-ping bg-primary/25 pointer-events-none" />
          )}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-6 h-6 text-white" />
              </motion.span>
            ) : (
              <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 flex flex-col md:inset-auto md:bottom-28 md:right-5 md:w-[390px] md:max-h-[600px] md:rounded-2xl overflow-hidden"
            style={{
              background: "hsl(222 20% 5% / 0.97)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
              maxHeight: "100dvh",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(195 85% 42%), hsl(200 90% 55%))" }}>
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-none">Rachana's AI Agent</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-[10px] font-mono text-muted-foreground/50">Portfolio · No hallucinations</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  aria-label="Clear chat"
                  className="p-2 rounded-lg text-muted-foreground/40 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="p-2 rounded-lg text-muted-foreground/40 hover:text-white hover:bg-white/[0.06] transition-colors md:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-5 min-h-0 scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div
                        className="max-w-[82%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white font-medium"
                        style={{ background: "hsl(195 85% 32%)" }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {msg.parts.map((part, i) => (
                        <RenderPart key={i} part={part} />
                      ))}
                      {msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestions.map((s) => (
                            <button
                              key={s}
                              onClick={() => sendMessage(s)}
                              className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-white/[0.08] text-muted-foreground/60 hover:text-white hover:border-primary/30 hover:bg-primary/[0.06] transition-all"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(195 85% 42%), hsl(200 90% 55%))" }}>
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-white/[0.07] bg-white/[0.03]">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-5 pt-3 border-t border-white/[0.05] shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.03] focus-within:border-primary/30 focus-within:bg-primary/[0.03] transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Rachana…"
                  aria-label="Ask the AI agent"
                  className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-muted-foreground/30 outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
                  style={{ background: "linear-gradient(135deg, hsl(195 85% 42%), hsl(200 90% 55%))" }}
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <p className="text-center text-[10px] font-mono text-muted-foreground/20 mt-2">
                Answers based only on Rachana's real portfolio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
