// ─── Founder AI Agent — Local Knowledge Base ───────────────────────────────
// All responses come from this file. No API calls. No hallucination.

export interface KBProject {
  id: string;
  title: string;
  role: string;
  description: string;
  domain: string;
  tags: string[];
  tech: string[];
  metric: { label: string; value: string } | null;
  github: string | null;
  demo: string | null;
  highlights: string[];
}

export interface KBCert {
  id: string;
  title: string;
  issuer: string;
  verify: string | null;
}

export const PROFILE = {
  name: "Rachana Baddam",
  location: "Jersey City, New Jersey",
  email: "rachana.reddy.ds@gmail.com",
  linkedin: "https://www.linkedin.com/in/rachana-baddam",
  github: "https://github.com/rachanareddy-data",
  role: "Data Scientist · ML Engineer · AI Product Builder",
  summary:
    "Data Scientist and ML Engineer with hands-on experience building AI-powered products and ML models across agriculture, healthcare, telecom, and finance. Founded and built Mana Rythu — a full-stack AI agricultural platform with GPT-4o integration — from design to production deployment. Strong across Python, React, TypeScript, PySpark, Scikit-learn, PostgreSQL, and SQL.",
};

export const EDUCATION = {
  degree: "M.S. Data Science",
  school: "Saint Peter's University",
  gpa: "3.68 / 4.0",
  graduated: "May 2026",
  coursework: [
    "Machine Learning",
    "Big Data Analytics",
    "Artificial Intelligence",
    "Data Mining",
    "Predictive Analytics",
    "Data Visualization",
    "Data Ethics",
  ],
};

export const PROJECTS: KBProject[] = [
  {
    id: "mana-rythu",
    title: "Mana Rythu",
    role: "Founder & Builder",
    description:
      "AI-powered agricultural platform connecting farmers with markets. Features a GPT-4o Crop Advisor, real-time farmer-to-buyer marketplace, APMC price intelligence, and live chat.",
    domain: "Agriculture · AI Product",
    tags: ["agriculture", "ai", "fullstack", "product", "gpt4o", "featured", "ml"],
    tech: ["React", "Node.js", "Express", "PostgreSQL", "WebSockets", "TypeScript", "GPT-4o"],
    metric: null,
    github: "https://github.com/rachanareddy-data/mana-rythu",
    demo: "https://mana-rythu-ai.replit.app/",
    highlights: [
      "Founded and built end-to-end — full product ownership",
      "GPT-4o powered crop advisory system",
      "Real-time marketplace with WebSockets",
      "APMC price intelligence integration",
      "Live in production",
    ],
  },
  {
    id: "wheat-yield",
    title: "Wheat Yield Prediction",
    role: "ML Engineer",
    description:
      "Random Forest model predicting global wheat yields from climate, soil, and geopolitical data using FAO and World Bank datasets. Deployed as an interactive Streamlit app.",
    domain: "Agriculture · ML",
    tags: ["agriculture", "ml", "prediction", "streamlit", "regression"],
    tech: ["Python", "Random Forest", "Scikit-learn", "Streamlit", "FAO Dataset", "World Bank Dataset"],
    metric: { label: "R²", value: "0.924" },
    github: "https://github.com/rachanareddy-data/wheat-yield-prediction",
    demo: "https://wheat-yield-prediction-jksxkuy86exsay2quhxq3p.streamlit.app/",
    highlights: [
      "R² = 0.924 — production-grade accuracy",
      "Random Forest with feature engineering",
      "FAO + World Bank data pipeline",
      "Deployed as interactive Streamlit app",
    ],
  },
  {
    id: "telecom-churn",
    title: "Telecom Churn Prediction",
    role: "Data Scientist",
    description:
      "PySpark MLlib pipeline processing large-scale distributed telecom data to identify customer churn risk early, before revenue is lost.",
    domain: "Telecom · Big Data",
    tags: ["telecom", "ml", "pyspark", "big-data", "classification"],
    tech: ["PySpark", "Spark MLlib", "Python"],
    metric: { label: "AUC", value: "0.81" },
    github: null,
    demo: null,
    highlights: [
      "Distributed ML at scale with PySpark",
      "AUC = 0.81 on large telecom dataset",
      "Spark MLlib classification pipeline",
    ],
  },
  {
    id: "loan-default",
    title: "Loan Default Prediction",
    role: "Data Scientist",
    description:
      "Gradient Boosting classifier with SMOTE for class imbalance, predicting loan default probability from applicant financial features.",
    domain: "Finance · ML",
    tags: ["finance", "ml", "classification", "risk", "gradient-boosting"],
    tech: ["Python", "Gradient Boosting", "SMOTE", "Scikit-learn"],
    metric: { label: "Accuracy", value: "88%" },
    github: "https://github.com/rachanareddy-data/Loan-Default-Prediction-using-Machine-Learning-Predictive-Analytics-Financial-Risk-Modeling",
    demo: null,
    highlights: [
      "88% accuracy on imbalanced financial data",
      "SMOTE for class imbalance handling",
      "Gradient Boosting with feature importance analysis",
    ],
  },
  {
    id: "maternal-health",
    title: "Maternal Health Risk Prediction",
    role: "Data Scientist",
    description:
      "ML classification model evaluating maternal health risk from clinical indicators (blood pressure, glucose, age) to enable proactive care decisions.",
    domain: "Healthcare · ML",
    tags: ["healthcare", "ml", "classification", "health", "clinical"],
    tech: ["Python", "Machine Learning", "Scikit-learn"],
    metric: { label: "Accuracy", value: "86%" },
    github: "https://github.com/rachanareddy-data/maternal-health-risk-prediction",
    demo: null,
    highlights: [
      "86% accuracy on clinical health data",
      "Risk stratification from clinical indicators",
      "Enables proactive clinical intervention",
    ],
  },
  {
    id: "fao-analysis",
    title: "FAO Agriculture Analysis",
    role: "Data Analyst",
    description:
      "Exploratory data analysis and visualization of FAO global agricultural datasets to uncover yield trends, food security patterns, and crop performance metrics.",
    domain: "Agriculture · Data Analysis",
    tags: ["agriculture", "data-analysis", "visualization", "eda"],
    tech: ["Python", "Pandas", "NumPy", "Data Visualization"],
    metric: null,
    github: "https://github.com/rachanareddy-data/fao-agriculture-analysis",
    demo: null,
    highlights: [
      "FAO global agricultural dataset",
      "Food security trend analysis",
      "Crop yield visualization",
    ],
  },
];

export const SKILL_GROUPS = [
  {
    category: "Machine Learning",
    skills: ["Random Forest", "Gradient Boosting", "Logistic Regression", "SVR", "SMOTE", "Feature Engineering"],
  },
  { category: "Big Data", skills: ["PySpark", "Spark MLlib"] },
  { category: "Languages", skills: ["Python", "TypeScript", "JavaScript", "SQL"] },
  { category: "Web & Full-Stack", skills: ["React", "Node.js", "Express", "PostgreSQL", "WebSockets"] },
  { category: "Data Tools", skills: ["Scikit-learn", "NumPy", "Pandas", "Streamlit", "Jupyter"] },
  { category: "AI", skills: ["GPT-4o Integration", "Predictive Analytics"] },
];

export const CERTS: KBCert[] = [
  { id: "ibm", title: "IBM Enterprise Design Thinking Practitioner", issuer: "IBM", verify: null },
  { id: "claude-101", title: "Claude 101", issuer: "Anthropic", verify: "https://verify.skilljar.com/c/fiuf9f24hbsv" },
  { id: "ai-fluency", title: "AI Fluency Framework and Foundations", issuer: "Anthropic", verify: "https://verify.skilljar.com/c/oszs5ge34ppc" },
  { id: "nw-static", title: "Static Website Development", issuer: "NxtWave", verify: "https://certificates.ccbp.in/intensive/static-website?id=MDPIVPPNCL" },
  { id: "nw-responsive", title: "Responsive Website Development", issuer: "NxtWave", verify: "https://certificates.ccbp.in/intensive/responsive-website?id=ASZOIADEKF" },
  { id: "nw-prog", title: "Programming Foundations", issuer: "NxtWave", verify: "https://certificates.ccbp.in/intensive/programming-foundations?id=WZMJGBXEKM" },
  { id: "nw-dynamic", title: "Dynamic Web Application", issuer: "NxtWave", verify: "https://certificates.ccbp.in/intensive/dynamic-web-application?id=KBMXRAPLC" },
  { id: "nw-db", title: "Introduction to Databases", issuer: "NxtWave", verify: "https://certificates.ccbp.in/intensive/introduction-to-databases?id=PPCVNCVFOJ" },
  { id: "nw-js", title: "JavaScript Essentials", issuer: "NxtWave", verify: "https://certificates.ccbp.in/intensive/javascript-essentials?id=CLEKWTNZTB" },
  { id: "nw-flex", title: "Flexbox", issuer: "NxtWave", verify: "https://certificates.ccbp.in/intensive/flexbox?id=LCXOJJUUQH" },
  { id: "nw-dev", title: "Developer Foundations", issuer: "NxtWave", verify: "https://certificates.ccbp.in/intensive/developer-foundations?id=KXVKJYZEXT" },
];

export const CONTACT = {
  email: "rachana.reddy.ds@gmail.com",
  linkedin: "https://www.linkedin.com/in/rachana-baddam",
  github: "https://github.com/rachanareddy-data",
  location: "Jersey City, New Jersey",
};
