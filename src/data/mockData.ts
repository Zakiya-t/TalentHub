import { Student, Company, JobListing, Application, InterviewSlot, Offer, AuditLog } from '../types';

export const initialStudent: Student = {
  id: 'std_rohan_01',
  name: 'Rohan Sharma',
  email: 'rohan.sharma@college.edu',
  usn: '1MS22CS142',
  branch: 'CSE',
  graduationYear: 2026,
  cgpa: 8.75,
  activeBacklogs: 0,
  clearedBacklogs: 1,
  skills: ['TypeScript', 'React.js', 'Python', 'Go', 'Docker', 'PostgreSQL', 'AWS', 'GraphQL', 'System Design'],
  bio: 'Final-year Computer Science Engineering student focused on resilient cloud infrastructure, microservices, and distributed web platforms. Former backend intern at a high-scale SaaS startup.',
  phone: '+91 98451 23098',
  linkedin: 'linkedin.com/in/rohansharma-dev',
  github: 'github.com/rohansharma-cloud',
  resumeFileName: 'Rohan_Sharma_CSE_Resume_2026.pdf',
  resumeLastUpdated: '2026-09-28',
  resumeAtsScore: 94,
  hasAcceptedOffer: false,
  profileCompletionPercentage: 92,
  visibilityPreference: 'All Recruiters',
  projects: [
    {
      id: 'proj_1',
      title: 'HyperScale Distributed Cache',
      tech: ['Go', 'gRPC', 'Raft Consensus', 'Docker'],
      description: 'Engineered an in-memory replicated key-value cluster achieving 45k QPS with sub-5ms p99 latency across 3 nodes.',
      link: 'https://github.com/rohansharma-cloud/hyperscale-cache'
    },
    {
      id: 'proj_2',
      title: 'Campus Pulse Realtime Analytics',
      tech: ['React', 'TypeScript', 'Node.js', 'Apache Kafka'],
      description: 'Real-time telemetry and student engagement platform handling 10k daily concurrent websocket connections.',
      link: 'https://github.com/rohansharma-cloud/campus-pulse'
    }
  ],
  certifications: [
    { id: 'cert_1', name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', year: 2025 },
    { id: 'cert_2', name: 'CKA: Certified Kubernetes Administrator', issuer: 'Cloud Native Computing Foundation', year: 2025 }
  ],
  experience: [
    {
      id: 'exp_1',
      role: 'Backend Engineering Intern',
      company: 'Krypton Labs',
      duration: 'May 2025 – July 2025 (3 mos)',
      description: 'Optimized event processing pipeline reducing API latency by 34%; containerized legacy ingestion services using Docker & Helm.'
    }
  ]
};

export const sampleStudents: Student[] = [
  initialStudent,
  {
    id: 'std_priya_02',
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    usn: '1MS22EC089',
    branch: 'ECE',
    graduationYear: 2026,
    cgpa: 7.80,
    activeBacklogs: 0,
    clearedBacklogs: 0,
    skills: ['C++', 'Python', 'Embedded C', 'IoT', 'MATLAB', 'RTOS'],
    bio: 'Electronics & Communication undergrad specializing in edge AI and firmware optimization.',
    phone: '+91 97412 88210',
    linkedin: 'linkedin.com/in/priyapatel-ece',
    github: 'github.com/priyapatel-embedded',
    resumeFileName: 'Priya_Patel_ECE_2026.pdf',
    resumeLastUpdated: '2026-09-20',
    resumeAtsScore: 88,
    hasAcceptedOffer: false,
    profileCompletionPercentage: 88,
    visibilityPreference: 'All Recruiters',
    projects: [],
    certifications: [],
    experience: []
  },
  {
    id: 'std_ananya_03',
    name: 'Ananya Rao',
    email: 'ananya.rao@college.edu',
    usn: '1MS22IS045',
    branch: 'ISE',
    graduationYear: 2026,
    cgpa: 9.30,
    activeBacklogs: 0,
    clearedBacklogs: 0,
    skills: ['Java', 'Spring Boot', 'Next.js', 'PostgreSQL', 'Kubernetes'],
    bio: 'Information Science topper. High performance system designer and competitive programmer.',
    phone: '+91 99014 34567',
    linkedin: 'linkedin.com/in/ananyarao',
    github: 'github.com/ananyarao',
    resumeFileName: 'Ananya_Rao_ISE_Resume.pdf',
    resumeLastUpdated: '2026-08-30',
    resumeAtsScore: 96,
    hasAcceptedOffer: true,
    acceptedOfferCompanyId: 'comp_finverve',
    profileCompletionPercentage: 100,
    visibilityPreference: 'Only Eligible Drives',
    projects: [],
    certifications: [],
    experience: []
  },
  {
    id: 'std_vikram_04',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@college.edu',
    usn: '1MS22ME112',
    branch: 'MECH',
    graduationYear: 2026,
    cgpa: 7.10,
    activeBacklogs: 1, // Has 1 active backlog (used to test backlog disqualification rule)
    clearedBacklogs: 0,
    skills: ['SolidWorks', 'Python', 'ANSYS', 'Mechatronics', 'Robotics'],
    bio: 'Mechanical engineering enthusiast with active focus on robotic actuators and computational fluid dynamics.',
    phone: '+91 98860 11982',
    linkedin: 'linkedin.com/in/vikrammehta-cad',
    github: 'github.com/vikrammehta',
    resumeFileName: 'Vikram_Mehta_Mech.pdf',
    resumeLastUpdated: '2026-09-12',
    resumeAtsScore: 78,
    hasAcceptedOffer: false,
    profileCompletionPercentage: 80,
    visibilityPreference: 'All Recruiters',
    projects: [],
    certifications: [],
    experience: []
  },
  {
    id: 'std_siddharth_05',
    name: 'Siddharth Verma',
    email: 'siddharth.v@college.edu',
    usn: '1MS22AD031',
    branch: 'AI & DS',
    graduationYear: 2026,
    cgpa: 8.00, // Boundary case: Exactly 8.00 CGPA
    activeBacklogs: 0,
    clearedBacklogs: 0,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'FastAPI', 'MLOps'],
    bio: 'Artificial Intelligence & Data Science researcher interested in computer vision and LLM fine-tuning.',
    phone: '+91 96118 76543',
    linkedin: 'linkedin.com/in/siddharth-ai',
    github: 'github.com/siddharth-v',
    resumeFileName: 'Siddharth_Verma_AIDS.pdf',
    resumeLastUpdated: '2026-09-25',
    resumeAtsScore: 91,
    hasAcceptedOffer: false,
    profileCompletionPercentage: 90,
    visibilityPreference: 'All Recruiters',
    projects: [],
    certifications: [],
    experience: []
  },
  {
    id: 'std_arjun_06',
    name: 'Arjun Nair',
    email: 'arjun.nair@college.edu',
    usn: '1MS22CS028',
    branch: 'CSE',
    graduationYear: 2026,
    cgpa: 8.40,
    activeBacklogs: 0,
    clearedBacklogs: 0,
    skills: ['C++', 'Rust', 'Linux Kernel', 'Computer Networks', 'Security'],
    bio: 'Low level systems programmer interested in network protocols and OS internals.',
    phone: '+91 97311 44556',
    linkedin: 'linkedin.com/in/arjunnair-systems',
    github: 'github.com/arjun-nair',
    resumeFileName: 'Arjun_Nair_Systems_2026.pdf',
    resumeLastUpdated: '2026-09-27',
    resumeAtsScore: 93,
    hasAcceptedOffer: false,
    profileCompletionPercentage: 94,
    visibilityPreference: 'All Recruiters',
    projects: [],
    certifications: [],
    experience: []
  }
];

export const sampleCompanies: Company[] = [
  {
    id: 'comp_apex',
    name: 'ApexCloud Technologies',
    tagline: 'Next-Generation Enterprise Cloud Orchestration',
    logo: 'AC',
    color: '#6366f1',
    industry: 'Cloud Infrastructure & SaaS',
    location: 'Bengaluru / Hyderabad',
    website: 'https://apexcloud.io',
    size: '1,200+ employees',
    description: 'ApexCloud builds planetary-scale multi-cloud deployment meshes serving Fortune 500 enterprises across 40 countries.'
  },
  {
    id: 'comp_finverve',
    name: 'FinVerve Systems',
    tagline: 'Ultra-low Latency Algorithmic Payment Architecture',
    logo: 'FV',
    color: '#10b981',
    industry: 'FinTech & Capital Markets',
    location: 'Bengaluru / Mumbai',
    website: 'https://finverve.tech',
    size: '3,500+ employees',
    description: 'Powering over $80B in annual transaction volume with institutional grade settlement platforms and microsecond transaction routing.'
  },
  {
    id: 'comp_quantum',
    name: 'Quantum Robotics',
    tagline: 'Autonomous Industrial Automation & Vision AI',
    logo: 'QR',
    color: '#8b5cf6',
    industry: 'Robotics & Artificial Intelligence',
    location: 'Bengaluru / Pune',
    website: 'https://quantumrobotics.ai',
    size: '800+ employees',
    description: 'Pioneering humanoid warehouse logistics and spatial vision intelligence deployed across global supply chain hubs.'
  },
  {
    id: 'comp_lumina',
    name: 'Lumina HealthTech',
    tagline: 'Precision Diagnostics & Genomic Intelligence',
    logo: 'LH',
    color: '#06b6d4',
    industry: 'Healthcare Technology',
    location: 'Bengaluru / Remote',
    website: 'https://luminahealth.io',
    size: '1,800+ employees',
    description: 'Connecting pathology clinics and oncology centers through AI-assisted biomarker detection and clinical decision support.'
  },
  {
    id: 'comp_cybervault',
    name: 'CyberVault Security',
    tagline: 'Zero-Trust Defense & Cloud Identity Infrastructure',
    logo: 'CV',
    color: '#f59e0b',
    industry: 'Cybersecurity',
    location: 'Gurugram / Hybrid',
    website: 'https://cybervault.security',
    size: '950+ employees',
    description: 'Next-generation automated threat intelligence, cloud entitlement management, and automated incident triage.'
  },
  {
    id: 'comp_datapulse',
    name: 'DataPulse AI',
    tagline: 'Enterprise Foundation Model Infrastructure',
    logo: 'DP',
    color: '#ec4899',
    industry: 'Artificial Intelligence',
    location: 'Bengaluru / Hybrid',
    website: 'https://datapulse.ai',
    size: '600+ employees',
    description: 'Accelerating frontier model fine-tuning, retrieval pipelines, and synthetic data validation for enterprise engineering teams.'
  },
  {
    id: 'comp_skylogic',
    name: 'SkyLogic Aerospace',
    tagline: 'Unmanned Aerial Systems & Flight Telemetry',
    logo: 'SL',
    color: '#3b82f6',
    industry: 'Aerospace & Defense Tech',
    location: 'Hyderabad',
    website: 'https://skylogicaero.com',
    size: '1,100+ employees',
    description: 'Engineering resilient telemetry firmware, autonomous flight navigation, and secure satellite communications.'
  },
  {
    id: 'comp_omni',
    name: 'Omnichannel Commerce',
    tagline: 'Hyper-Personalized Global Retail Platforms',
    logo: 'OC',
    color: '#64748b',
    industry: 'E-Commerce & Logistics',
    location: 'Noida / Bengaluru',
    website: 'https://omnichannel.global',
    size: '8,000+ employees',
    description: 'Powering high-velocity inventory management and digital storefronts for major lifestyle brands.'
  }
];

export const sampleJobListings: JobListing[] = [
  {
    id: 'job_apex_01',
    companyId: 'comp_apex',
    companyName: 'ApexCloud Technologies',
    companyLogo: 'AC',
    companyColor: '#6366f1',
    title: 'Associate Cloud Platform Engineer',
    roleCategory: 'Cloud & Infrastructure',
    type: 'Full-Time FTE',
    workMode: 'Hybrid',
    location: 'Bengaluru',
    packageLPA: 24.0,
    baseSalaryLPA: 19.5,
    performanceBonusLPA: 4.5,
    minCgpa: 8.0, // Minimum CGPA cutoff
    allowedBranches: ['CSE', 'ISE', 'ECE', 'AI & DS'],
    maxActiveBacklogsAllowed: 0,
    allowAcceptedOfferHolders: false,
    deadline: '2026-10-24',
    postedDate: '2026-10-02',
    isOpen: true,
    vacancies: 18,
    description: 'Join the Core Infrastructure team to architect distributed control planes, telemetry collectors, and Kubernetes controllers that manage millions of multi-region workloads.',
    responsibilities: [
      'Design and deploy Kubernetes custom resource operators and scalable service mesh ingress layers.',
      'Build telemetry collectors monitoring distributed latency, CPU throttling, and network throughput.',
      'Participate in on-call rotations and author automated remediation playbooks for cloud incidents.',
      'Collaborate with global security teams on zero-trust identity policies and mTLS service communication.'
    ],
    requirements: [
      'Strong conceptual grounding in Operating Systems, TCP/IP networking, and concurrency.',
      'Proficiency in Go, Python, or Modern C++ with hands-on Linux system debugging experience.',
      'Minimum CGPA of 8.00 at the time of drive registration.',
      'Zero active backlogs across all semesters.'
    ],
    skillsRequired: ['Go', 'Docker', 'Kubernetes', 'Linux Internals', 'AWS / GCP', 'gRPC'],
    perks: ['₹3.5L Annual Learning & Certification Allowance', 'Comprehensive Health Cover for Family (₹10L)', 'Relocation Bonus & Temporary Transit Stay', 'Ergonomic Home Office Stipend'],
    rounds: [
      { roundNumber: 1, title: 'Online Assessment', type: 'Online Assessment', description: '90 mins: 2 DSA coding challenges + 20 OS & Networking MCQs on HackerRank', tentativeDate: '2026-10-28' },
      { roundNumber: 2, title: 'Technical Round 1', type: 'Technical Round 1', description: '60 mins: Data structures, concurrency, tree/graph algorithms and live code walkthrough', tentativeDate: '2026-11-03' },
      { roundNumber: 3, title: 'System Design & OS', type: 'System Design', description: '60 mins: Distributed caching, rate-limiting, and thread synchronization scenarios', tentativeDate: '2026-11-07' },
      { roundNumber: 4, title: 'Leadership & Culture Fit', type: 'HR & Leadership', description: '45 mins: Behavioral interview with VP of Infrastructure Engineering', tentativeDate: '2026-11-10' }
    ]
  },
  {
    id: 'job_finverve_02',
    companyId: 'comp_finverve',
    companyName: 'FinVerve Systems',
    companyLogo: 'FV',
    companyColor: '#10b981',
    title: 'Software Engineer – Core FinTech Banking',
    roleCategory: 'Software Engineering',
    type: 'Full-Time FTE',
    workMode: 'On-site',
    location: 'Bengaluru',
    packageLPA: 18.5,
    baseSalaryLPA: 15.0,
    performanceBonusLPA: 3.5,
    minCgpa: 7.5,
    allowedBranches: [], // Empty means OPEN TO ALL BRANCHES
    maxActiveBacklogsAllowed: 0,
    allowAcceptedOfferHolders: false,
    deadline: '2026-10-18',
    postedDate: '2026-09-28',
    isOpen: true,
    vacancies: 25,
    description: 'Help build high-throughput ledger engines, UPI instant settlement switches, and fraud anomaly detection algorithms processing tens of thousands of requests per second.',
    responsibilities: [
      'Write rock-solid transactional code guaranteeing ACID compliance across distributed data stores.',
      'Implement real-time risk scoring modules using Redis and Kafka streaming pipelines.',
      'Optimize database queries and indexing strategies for PostgreSQL and ScyllaDB.',
      'Conduct rigorous code reviews, automated integration tests, and chaos engineering drills.'
    ],
    requirements: [
      'Deep understanding of relational databases, transactions, isolation levels, and indexing.',
      'Fluency in Java, C++, TypeScript, or Python with solid algorithmic problem solving skills.',
      'Minimum CGPA of 7.50 with no active backlogs.',
      'Open to all engineering branches.'
    ],
    skillsRequired: ['Java / Spring Boot', 'PostgreSQL', 'Kafka', 'System Design', 'Redis', 'Algorithms'],
    perks: ['Performance Linked Annual Bonus', 'Free Gourmet Meals & Shuttle Service', 'Wellness and Gym Reimbursement', 'Sponsored Higher Education Support'],
    rounds: [
      { roundNumber: 1, title: 'CodeSignal Assessment', type: 'Online Assessment', description: '75 mins: 3 Algorithmic problems focusing on HashMaps, Dynamic Programming, and SQL', tentativeDate: '2026-10-22' },
      { roundNumber: 2, title: 'Technical Problem Solving', type: 'Technical Round 1', description: '60 mins: Data structures, memory management, and database query optimization', tentativeDate: '2026-10-26' },
      { roundNumber: 3, title: 'System & Architecture', type: 'Technical Round 2', description: '60 mins: Transactional consistency, fault tolerance, and API design', tentativeDate: '2026-10-29' },
      { roundNumber: 4, title: 'HR & Values', type: 'HR & Leadership', description: '30 mins: Alignment with company principles and career roadmap', tentativeDate: '2026-11-02' }
    ]
  },
  {
    id: 'job_datapulse_03',
    companyId: 'comp_datapulse',
    companyName: 'DataPulse AI',
    companyLogo: 'DP',
    companyColor: '#ec4899',
    title: 'Machine Learning & Applied AI Engineer',
    roleCategory: 'Artificial Intelligence / ML',
    type: 'Full-Time FTE',
    workMode: 'Hybrid',
    location: 'Bengaluru',
    packageLPA: 28.0,
    baseSalaryLPA: 22.0,
    performanceBonusLPA: 6.0,
    minCgpa: 8.5, // High CGPA cutoff (8.5)
    allowedBranches: ['CSE', 'ISE', 'AI & DS'],
    maxActiveBacklogsAllowed: 0,
    allowAcceptedOfferHolders: false,
    deadline: '2026-10-30',
    postedDate: '2026-10-04',
    isOpen: true,
    vacancies: 10,
    description: 'Work alongside leading AI researchers on retrieval augmented generation (RAG), parameter-efficient fine-tuning (LoRA), and continuous alignment of multimodal models.',
    responsibilities: [
      'Train, fine-tune, and evaluate transformer models on custom domain-specific datasets.',
      'Build low-latency vector search indices using Milvus, Qdrant, and TensorRT-LLM.',
      'Deploy models into production with Triton Inference Server and monitor embedding drift.',
      'Benchmark and profile GPU memory utilization, quantization (FP8, INT4), and throughput.'
    ],
    requirements: [
      'Strong mathematical foundation in Linear Algebra, Probability, Calculus, and Optimization.',
      'Proficiency in PyTorch, Hugging Face transformers, and Python ecosystem.',
      'Minimum CGPA of 8.50 with clean academic history.',
      'Restricted to CSE, ISE, and AI & DS branches.'
    ],
    skillsRequired: ['PyTorch', 'Hugging Face', 'Python', 'Vector DBs', 'TensorRT', 'CUDA'],
    perks: ['Access to Dedicated H100 GPU Clusters', 'International AI Conference Sponsorship (NeurIPS/ICLR)', 'Comprehensive Health & Dental Coverage', 'Flexible Working Hours'],
    rounds: [
      { roundNumber: 1, title: 'AI Foundations & Code', type: 'Online Assessment', description: '90 mins: Deep learning theory, calculus math problems, and PyTorch coding challenge', tentativeDate: '2026-11-04' },
      { roundNumber: 2, title: 'ML Systems & Modeling', type: 'Technical Round 1', description: '60 mins: Attention mechanisms, optimization methods, and training loss troubleshooting', tentativeDate: '2026-11-08' },
      { roundNumber: 3, title: 'Applied Research Project Review', type: 'Technical Round 2', description: '60 mins: In-depth technical defense of candidate GitHub projects and papers', tentativeDate: '2026-11-12' },
      { roundNumber: 4, title: 'Founding Team Chat', type: 'HR & Leadership', description: '45 mins: Strategic conversation with Co-Founder & Head of AI', tentativeDate: '2026-11-15' }
    ]
  },
  {
    id: 'job_quantum_04',
    companyId: 'comp_quantum',
    companyName: 'Quantum Robotics',
    companyLogo: 'QR',
    companyColor: '#8b5cf6',
    title: 'Autonomous Systems & Robotics Engineer',
    roleCategory: 'Robotics & Hardware',
    type: 'Full-Time FTE',
    workMode: 'On-site',
    location: 'Pune / Bengaluru',
    packageLPA: 22.0,
    baseSalaryLPA: 17.5,
    performanceBonusLPA: 4.5,
    minCgpa: 8.0,
    allowedBranches: ['CSE', 'ECE', 'EEE', 'MECH', 'AI & DS'],
    maxActiveBacklogsAllowed: 0,
    allowAcceptedOfferHolders: false,
    deadline: '2026-10-22',
    postedDate: '2026-10-01',
    isOpen: true,
    vacancies: 12,
    description: 'Design real-time robotic motion planning pipelines, sensor fusion algorithms (LiDAR + Depth Cameras), and hardware-in-the-loop simulation frameworks.',
    responsibilities: [
      'Implement SLAM (Simultaneous Localization and Mapping) and trajectory optimization algorithms in C++.',
      'Optimize ROS2 nodes and message pipelines for embedded NVIDIA Jetson platforms.',
      'Calibrate camera-LiDAR multi-modal sensors and handle real-world sensor noise.',
      'Collaborate with mechanical engineers to validate physical actuator tolerances.'
    ],
    requirements: [
      'Proficiency in Modern C++ (C++17/20), Python, and Linux RTOS concepts.',
      'Experience with ROS2, OpenCV, and kinematic simulation (Gazebo / Isaac Sim).',
      'Minimum CGPA of 8.00.',
      'Open to CSE, ECE, EEE, MECH, and AI & DS.'
    ],
    skillsRequired: ['Modern C++', 'ROS2', 'SLAM', 'OpenCV', 'Python', 'Kinematics'],
    perks: ['Hands-on Robotics Hardware Lab Access', 'Patenting Incentives & Cash Grants', 'Daily On-site Catered Breakfast & Lunch', 'Relocation Allowance'],
    rounds: [
      { roundNumber: 1, title: 'Robotics & Math Test', type: 'Online Assessment', description: '75 mins: Coordinate frames, transforms, kinematic matrices, and C++ algorithm problems', tentativeDate: '2026-10-25' },
      { roundNumber: 2, title: 'C++ Systems & Architecture', type: 'Technical Round 1', description: '60 mins: Memory safety, pointers, multithreading, and ROS2 architecture', tentativeDate: '2026-10-29' },
      { roundNumber: 3, title: 'Hardware Simulation Case', type: 'System Design', description: '60 mins: Edge case obstacle avoidance scenario and latency budget breakdown', tentativeDate: '2026-11-02' },
      { roundNumber: 4, title: 'Leadership & Team Fit', type: 'HR & Leadership', description: '30 mins: Conversation with Director of Autonomy', tentativeDate: '2026-11-05' }
    ]
  },
  {
    id: 'job_lumina_05',
    companyId: 'comp_lumina',
    companyName: 'Lumina HealthTech',
    companyLogo: 'LH',
    companyColor: '#06b6d4',
    title: 'Full Stack Product Engineer',
    roleCategory: 'Full Stack Web',
    type: 'Full-Time FTE',
    workMode: 'Hybrid',
    location: 'Bengaluru',
    packageLPA: 16.0,
    baseSalaryLPA: 13.5,
    performanceBonusLPA: 2.5,
    minCgpa: 7.0, // Accessible CGPA (7.0)
    allowedBranches: ['CSE', 'ISE', 'ECE', 'AI & DS'],
    maxActiveBacklogsAllowed: 0,
    allowAcceptedOfferHolders: false,
    deadline: '2026-11-05',
    postedDate: '2026-10-06',
    isOpen: true,
    vacancies: 20,
    description: 'Build patient-centric clinical portals, real-time diagnostic dashboard analytics, and secure FHIR/HL7 compliant healthcare APIs used by doctors worldwide.',
    responsibilities: [
      'Develop modular, accessible, and fast web applications using React, TypeScript, and Tailwind CSS.',
      'Construct high-reliability REST and GraphQL endpoints backed by Node.js, Express, and PostgreSQL.',
      'Implement HIPAA-compliant data encryption, audit trails, and role-based access control (RBAC).',
      'Maintain automated testing suites (Vitest, Playwright) achieving >85% code coverage.'
    ],
    requirements: [
      'Strong grasp of JavaScript / TypeScript, modern React patterns, and CSS architecture.',
      'Experience with relational databases and API design principles.',
      'Minimum CGPA of 7.00 with 0 active backlogs.'
    ],
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'REST APIs'],
    perks: ['Comprehensive Health Insurance (₹7L)', 'Annual Tech Gadget Allowance', 'Flexible Work from Home Days', 'Fitness & Mental Wellbeing Subsidies'],
    rounds: [
      { roundNumber: 1, title: 'Frontend & Fullstack OA', type: 'Online Assessment', description: '90 mins: JS fundamentals, React UI component build, and async API integration', tentativeDate: '2026-11-08' },
      { roundNumber: 2, title: 'Live Coding & System Review', type: 'Technical Round 1', description: '60 mins: State management, rendering performance, and data normalization', tentativeDate: '2026-11-12' },
      { roundNumber: 3, title: 'Product Architecture & Security', type: 'System Design', description: '45 mins: Healthcare data privacy, caching, and WebSocket updates', tentativeDate: '2026-11-16' },
      { roundNumber: 4, title: 'People & Values Interview', type: 'HR & Leadership', description: '30 mins: Behavioral evaluation with Engineering Director', tentativeDate: '2026-11-18' }
    ]
  },
  {
    id: 'job_cybervault_06',
    companyId: 'comp_cybervault',
    companyName: 'CyberVault Security',
    companyLogo: 'CV',
    companyColor: '#f59e0b',
    title: 'Cloud Security & DevSecOps Engineer',
    roleCategory: 'Cybersecurity',
    type: 'Full-Time FTE',
    workMode: 'Hybrid',
    location: 'Gurugram / Bengaluru',
    packageLPA: 15.5,
    baseSalaryLPA: 13.0,
    performanceBonusLPA: 2.5,
    minCgpa: 7.0,
    allowedBranches: ['CSE', 'ISE', 'ECE', 'AI & DS'],
    maxActiveBacklogsAllowed: 0,
    allowAcceptedOfferHolders: false,
    deadline: '2026-10-26',
    postedDate: '2026-10-03',
    isOpen: true,
    vacancies: 8,
    description: 'Protect modern cloud environments through automated vulnerability scanning, container security posture management, and IAM privilege reduction pipelines.',
    responsibilities: [
      'Build automated security guardrails for CI/CD pipelines using GitHub Actions and Terraform.',
      'Conduct static and dynamic application security testing (SAST / DAST).',
      'Analyze attack surfaces across AWS and Azure cloud infrastructure.',
      'Author custom security detection rules for SIEM platforms.'
    ],
    requirements: [
      'Understanding of OWASP Top 10, network protocols, cryptography, and cloud identity models.',
      'Scripting proficiency in Python or Bash.',
      'Minimum CGPA of 7.00.'
    ],
    skillsRequired: ['Cloud Security', 'Python', 'Terraform', 'OWASP Top 10', 'Linux', 'Docker'],
    perks: ['Certification Reimbursement (OSCP/AWS Security)', 'High-End MacBook Pro M3', 'Annual Performance Incentive'],
    rounds: [
      { roundNumber: 1, title: 'Security Aptitude & Logic', type: 'Online Assessment', description: '60 mins: Cryptography, Linux commands, web vulnerabilities, and Python scripting', tentativeDate: '2026-10-29' },
      { roundNumber: 2, title: 'Technical Security Deep Dive', type: 'Technical Round 1', description: '60 mins: Hands-on vulnerability triage, code review, and cloud IAM scenarios', tentativeDate: '2026-11-03' },
      { roundNumber: 3, title: 'Managerial & Cultural Fit', type: 'HR & Leadership', description: '45 mins: Discussion on ethics, teamwork, and incident handling', tentativeDate: '2026-11-06' }
    ]
  },
  {
    id: 'job_skylogic_07',
    companyId: 'comp_skylogic',
    companyName: 'SkyLogic Aerospace',
    companyLogo: 'SL',
    companyColor: '#3b82f6',
    title: 'Avionics Embedded Software Trainee',
    roleCategory: 'Embedded Systems',
    type: 'Internship + PPO',
    workMode: 'On-site',
    location: 'Hyderabad',
    packageLPA: 12.0,
    stipendPerMonth: 45000,
    baseSalaryLPA: 10.0,
    performanceBonusLPA: 2.0,
    minCgpa: 6.5, // Inclusive CGPA threshold (6.5)
    allowedBranches: [], // Open to all branches
    maxActiveBacklogsAllowed: 0,
    allowAcceptedOfferHolders: false,
    deadline: '2026-11-10',
    postedDate: '2026-10-05',
    isOpen: true,
    vacancies: 15,
    description: 'Work on DO-178C compliant safety-critical software, drone flight stabilization telemetry, and low-power microcontroller communications.',
    responsibilities: [
      'Write deterministic C code for STM32 and ARM Cortex microcontrollers.',
      'Test CAN, SPI, I2C, and UART serial communication protocols with hardware oscilloscopes.',
      'Document software requirements and automated unit test matrices.'
    ],
    requirements: [
      'Solid command of C programming, microcontrollers, and digital electronics.',
      'Minimum CGPA of 6.50.',
      'Open to all branches.'
    ],
    skillsRequired: ['Embedded C', 'ARM Cortex', 'CAN / SPI / I2C', 'RTOS', 'Git'],
    perks: ['₹45,000/month during 6-month internship', 'Full PPO conversion upon graduation', 'Subsidized Company Accommodation'],
    rounds: [
      { roundNumber: 1, title: 'Electronics & C Assessment', type: 'Online Assessment', description: '60 mins: Bitwise operations, pointers, state machines, and circuits', tentativeDate: '2026-11-14' },
      { roundNumber: 2, title: 'Technical Interview', type: 'Technical Round 1', description: '45 mins: C pointers, interrupts, memory maps, and hardware interfacing', tentativeDate: '2026-11-18' },
      { roundNumber: 3, title: 'HR & Verification', type: 'HR & Leadership', description: '30 mins: Document verification and onboarding details', tentativeDate: '2026-11-20' }
    ]
  },
  {
    id: 'job_omni_08',
    companyId: 'comp_omni',
    companyName: 'Omnichannel Commerce',
    companyLogo: 'OC',
    companyColor: '#64748b',
    title: 'Associate Digital Solutions Analyst',
    roleCategory: 'Business Technology',
    type: 'Full-Time FTE',
    workMode: 'Hybrid',
    location: 'Noida',
    packageLPA: 9.5,
    baseSalaryLPA: 8.0,
    performanceBonusLPA: 1.5,
    minCgpa: 6.0,
    allowedBranches: [],
    maxActiveBacklogsAllowed: 0,
    allowAcceptedOfferHolders: false,
    deadline: '2026-10-01', // Expired deadline
    postedDate: '2026-09-15',
    isOpen: false, // CLOSED DRIVE (tests closed listing rule!)
    vacancies: 30,
    description: 'Drive analytics dashboards, inventory forecasting pipelines, and ERP system integrations for modern retail fulfillment operations.',
    responsibilities: [
      'Build SQL dashboards and ETL data flows for logistics metrics.',
      'Assist product managers in gathering digital workflow requirements.',
      'Perform user acceptance testing on warehouse management software.'
    ],
    requirements: [
      'Basic SQL, Excel modeling, and problem solving skills.',
      'Minimum CGPA of 6.00.',
      'Open to all branches.'
    ],
    skillsRequired: ['SQL', 'Data Analytics', 'Python', 'Excel', 'Problem Solving'],
    perks: ['Annual Bonus', 'Shuttle Transport', 'Health Insurance'],
    rounds: [
      { roundNumber: 1, title: 'Aptitude & SQL', type: 'Online Assessment', description: '60 mins', tentativeDate: '2026-09-25' }
    ]
  }
];

export const initialApplications: Application[] = [
  {
    id: 'app_finverve_01',
    jobId: 'job_finverve_02',
    studentId: 'std_rohan_01',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.sharma@college.edu',
    studentUsn: '1MS22CS142',
    studentBranch: 'CSE',
    studentCgpa: 8.75,
    companyId: 'comp_finverve',
    companyName: 'FinVerve Systems',
    jobTitle: 'Software Engineer – Core FinTech Banking',
    packageLPA: 18.5,
    appliedDate: '2026-09-29',
    status: 'Offered',
    lastUpdated: '2026-10-08',
    hasOffer: true,
    offerId: 'off_finverve_01',
    timeline: [
      { stage: 'Applied', timestamp: '2026-09-29 10:15 AM', notes: 'Application submitted with verified resume' },
      { stage: 'Shortlisted', timestamp: '2026-10-01 03:30 PM', notes: 'Academic criteria and resume screening passed' },
      { stage: 'Interview Scheduled', timestamp: '2026-10-03 11:00 AM', notes: 'Online Assessment cleared with 96% score' },
      { stage: 'Interviewed', timestamp: '2026-10-06 04:45 PM', notes: 'Completed Tech 1, Tech 2, and Leadership rounds' },
      { stage: 'Offered', timestamp: '2026-10-08 02:00 PM', notes: 'Official offer letter issued. CTC: ₹18.50 LPA' }
    ]
  },
  {
    id: 'app_apex_02',
    jobId: 'job_apex_01',
    studentId: 'std_rohan_01',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.sharma@college.edu',
    studentUsn: '1MS22CS142',
    studentBranch: 'CSE',
    studentCgpa: 8.75,
    companyId: 'comp_apex',
    companyName: 'ApexCloud Technologies',
    jobTitle: 'Associate Cloud Platform Engineer',
    packageLPA: 24.0,
    appliedDate: '2026-10-03',
    status: 'Interview Scheduled',
    lastUpdated: '2026-10-07',
    hasOffer: false,
    timeline: [
      { stage: 'Applied', timestamp: '2026-10-03 09:20 AM', notes: 'Profile registered for drive' },
      { stage: 'Shortlisted', timestamp: '2026-10-05 01:10 PM', notes: 'Eligible with 8.75 CGPA (Cutoff: 8.00)' },
      { stage: 'Interview Scheduled', timestamp: '2026-10-07 05:00 PM', notes: 'Technical Round 2 scheduled for Oct 12, 11:00 AM' }
    ]
  },
  {
    id: 'app_lumina_03',
    jobId: 'job_lumina_05',
    studentId: 'std_rohan_01',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.sharma@college.edu',
    studentUsn: '1MS22CS142',
    studentBranch: 'CSE',
    studentCgpa: 8.75,
    companyId: 'comp_lumina',
    companyName: 'Lumina HealthTech',
    jobTitle: 'Full Stack Product Engineer',
    packageLPA: 16.0,
    appliedDate: '2026-10-06',
    status: 'Shortlisted',
    lastUpdated: '2026-10-08',
    hasOffer: false,
    timeline: [
      { stage: 'Applied', timestamp: '2026-10-06 02:40 PM', notes: 'Application verified' },
      { stage: 'Shortlisted', timestamp: '2026-10-08 10:15 AM', notes: 'Screened for Online Assessment slot' }
    ]
  },
  {
    id: 'app_cybervault_04',
    jobId: 'job_cybervault_06',
    studentId: 'std_rohan_01',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.sharma@college.edu',
    studentUsn: '1MS22CS142',
    studentBranch: 'CSE',
    studentCgpa: 8.75,
    companyId: 'comp_cybervault',
    companyName: 'CyberVault Security',
    jobTitle: 'Cloud Security & DevSecOps Engineer',
    packageLPA: 15.5,
    appliedDate: '2026-10-07',
    status: 'Applied',
    lastUpdated: '2026-10-07',
    hasOffer: false,
    timeline: [
      { stage: 'Applied', timestamp: '2026-10-07 11:30 AM', notes: 'Application received and queued for recruiter evaluation' }
    ]
  },
  // Candidate records for Recruiter and Coordinator views
  {
    id: 'app_priya_apex',
    jobId: 'job_apex_01',
    studentId: 'std_priya_02',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@college.edu',
    studentUsn: '1MS22EC089',
    studentBranch: 'ECE',
    studentCgpa: 7.80,
    companyId: 'comp_apex',
    companyName: 'ApexCloud Technologies',
    jobTitle: 'Associate Cloud Platform Engineer',
    packageLPA: 24.0,
    appliedDate: '2026-10-04',
    status: 'Rejected',
    lastUpdated: '2026-10-05',
    hasOffer: false,
    rejectionReason: 'CGPA 7.80 does not satisfy the minimum requirement of 8.00 for ApexCloud Technologies.',
    timeline: [
      { stage: 'Applied', timestamp: '2026-10-04 10:00 AM' },
      { stage: 'Rejected', timestamp: '2026-10-05 11:00 AM', notes: 'Ineligible criteria cutoff' }
    ]
  },
  {
    id: 'app_siddharth_apex',
    jobId: 'job_apex_01',
    studentId: 'std_siddharth_05',
    studentName: 'Siddharth Verma',
    studentEmail: 'siddharth.v@college.edu',
    studentUsn: '1MS22AD031',
    studentBranch: 'AI & DS',
    studentCgpa: 8.00, // Exact boundary
    companyId: 'comp_apex',
    companyName: 'ApexCloud Technologies',
    jobTitle: 'Associate Cloud Platform Engineer',
    packageLPA: 24.0,
    appliedDate: '2026-10-04',
    status: 'Shortlisted',
    lastUpdated: '2026-10-06',
    hasOffer: false,
    timeline: [
      { stage: 'Applied', timestamp: '2026-10-04 11:20 AM' },
      { stage: 'Shortlisted', timestamp: '2026-10-06 09:30 AM', notes: 'CGPA exactly meets the 8.00 cutoff (Eligible)' }
    ]
  },
  {
    id: 'app_arjun_apex',
    jobId: 'job_apex_01',
    studentId: 'std_arjun_06',
    studentName: 'Arjun Nair',
    studentEmail: 'arjun.nair@college.edu',
    studentUsn: '1MS22CS028',
    studentBranch: 'CSE',
    studentCgpa: 8.40,
    companyId: 'comp_apex',
    companyName: 'ApexCloud Technologies',
    jobTitle: 'Associate Cloud Platform Engineer',
    packageLPA: 24.0,
    appliedDate: '2026-10-04',
    status: 'Interviewed',
    lastUpdated: '2026-10-08',
    hasOffer: false,
    timeline: [
      { stage: 'Applied', timestamp: '2026-10-04 09:00 AM' },
      { stage: 'Shortlisted', timestamp: '2026-10-05 02:00 PM' },
      { stage: 'Interview Scheduled', timestamp: '2026-10-06 10:00 AM' },
      { stage: 'Interviewed', timestamp: '2026-10-08 04:00 PM', notes: 'Completed Round 2; awaiting final offer decision' }
    ]
  }
];

export const initialInterviews: InterviewSlot[] = [
  {
    id: 'int_apex_01',
    applicationId: 'app_apex_02',
    jobId: 'job_apex_01',
    studentId: 'std_rohan_01',
    studentName: 'Rohan Sharma',
    companyId: 'comp_apex',
    companyName: 'ApexCloud Technologies',
    jobTitle: 'Associate Cloud Platform Engineer',
    roundNumber: 2,
    roundTitle: 'Technical Round 2: Distributed Systems & Concurrency',
    date: '2026-10-12',
    time: '11:00 AM - 12:00 PM IST',
    durationMinutes: 60,
    interviewerName: 'Vikramaditya Sengupta',
    interviewerTitle: 'Staff Infrastructure Architect, ApexCloud',
    meetingLink: 'https://meet.google.com/xyz-talenthub-apex',
    venue: 'Google Meet (Virtual Video Link)',
    status: 'Scheduled',
    notes: 'Be prepared to design a distributed rate limiter and walk through goroutine/thread synchronization and Raft replication semantics.',
    studentChecklistCompleted: true
  },
  {
    id: 'int_finverve_past',
    applicationId: 'app_finverve_01',
    jobId: 'job_finverve_02',
    studentId: 'std_rohan_01',
    studentName: 'Rohan Sharma',
    companyId: 'comp_finverve',
    companyName: 'FinVerve Systems',
    jobTitle: 'Software Engineer – Core FinTech Banking',
    roundNumber: 3,
    roundTitle: 'Leadership & Architecture Committee',
    date: '2026-10-06',
    time: '04:00 PM - 05:00 PM IST',
    durationMinutes: 60,
    interviewerName: 'Deepak Narayanan',
    interviewerTitle: 'VP of Engineering, FinVerve',
    meetingLink: 'https://finverve.zoom.us/j/demo98210382',
    venue: 'Virtual Zoom Call',
    status: 'Completed',
    notes: 'Candidate demonstrated exceptional clarity on transaction rollback boundaries and distributed lock lease renewals.',
    studentChecklistCompleted: true
  }
];

export const initialOffers: Offer[] = [
  {
    id: 'off_finverve_01',
    applicationId: 'app_finverve_01',
    jobId: 'job_finverve_02',
    studentId: 'std_rohan_01',
    studentName: 'Rohan Sharma',
    companyId: 'comp_finverve',
    companyName: 'FinVerve Systems',
    jobTitle: 'Software Engineer – Core FinTech Banking',
    packageLPA: 18.5,
    baseSalaryLPA: 15.0,
    retentionBonusLPA: 2.0,
    stockOptionsValue: '₹1.5L ESOPs vesting over 4 years',
    location: 'Bengaluru (Koramangala Tech Park)',
    offerDate: '2026-10-08',
    acceptanceDeadline: '2026-10-20',
    status: 'Pending Decision',
    letterUrl: '/documents/FinVerve_Official_Offer_Letter_Rohan_Sharma.pdf',
    termsSummary: 'Includes 100% Medical Coverage, ₹50,000 Relocation Allowance, and 24 Annual Paid Leaves.',
    policyWarningNotice: 'Season Placement Policy: Under university placement guidelines, accepting this offer will mark your placement status as "Placed" and automatically render you ineligible for further campus placement drives.'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-10-09 14:15:20',
    actor: 'Dr. S. K. Murthy',
    actorRole: 'Placement Coordinator',
    action: 'Shortlist Simulation Run',
    target: 'ApexCloud Technologies (Drive ID: job_apex_01)',
    details: 'Executed filter across 480 registered seniors. 312 students qualified; 168 disqualified due to CGPA/backlogs.'
  },
  {
    id: 'log_02',
    timestamp: '2026-10-09 11:20:05',
    actor: 'Deepak Narayanan',
    actorRole: 'Recruiter (FinVerve)',
    action: 'Offer Letter Issued',
    target: 'Rohan Sharma (1MS22CS142)',
    details: 'Issued formal offer of ₹18.50 LPA following positive final round assessment.'
  },
  {
    id: 'log_03',
    timestamp: '2026-10-08 16:40:12',
    actor: 'Placement Office Admin',
    actorRole: 'Coordinator Console',
    action: 'Drive Eligibility Updated',
    target: 'Quantum Robotics (job_quantum_04)',
    details: 'Extended eligible branch list to include AI & DS department.'
  },
  {
    id: 'log_04',
    timestamp: '2026-10-07 10:00:30',
    actor: 'Rohan Sharma',
    actorRole: 'Student',
    action: 'Drive Application Submitted',
    target: 'CyberVault Security',
    details: 'Application submitted with updated resume version 3.2.'
  }
];

export const platformStats = {
  placementRatePercentage: 92.4,
  participatingCompanies: 184,
  highestPackageLPA: 44.5,
  averagePackageLPA: 12.8,
  medianPackageLPA: 10.5,
  totalActiveDrives: 28,
  totalOffersIssued: 1420,
  registeredStudents: 1540,
  interviewsScheduledThisWeek: 164
};
