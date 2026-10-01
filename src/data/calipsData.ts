import { CalipsCategory, CalipsCategoryInfo, Career, MajorProgram } from '../types/index.ts';

export const CALIPS_CATEGORIES: Record<CalipsCategory, CalipsCategoryInfo> = {
  C: {
    code: 'C',
    name: 'Conventional',
    archetype: 'The Organizer',
    tagline: 'Order, accuracy, systems, and execution excellence',
    color: 'from-amber-400 to-yellow-500',
    bgGrad: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500',
    description:
      'You excel in structured environments with clear procedures, data precision, organized workflows, and high attention to detail. You are the operational backbone of any great endeavor.',
    traits: ['Detail-Oriented', 'Methodical', 'Organized', 'Reliable', 'Systematic', 'Precise'],
    workVibe: 'Predictable workflows, tidy information architectures, error-free deliverables, and clear milestones.',
    strengths: [
      'Data and record management with zero tolerance for oversights',
      'Translating abstract chaotic concepts into structured operating procedures',
      'Financial accuracy, data compliance, and quality assurance',
      'Project planning and reliable timeline execution',
    ],
  },
  A: {
    code: 'A',
    name: 'Artistic',
    archetype: 'The Creator',
    tagline: 'Imagination, expressive freedom, aesthetics, and originality',
    color: 'from-fuchsia-500 to-pink-500',
    bgGrad: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    borderColor: 'border-pink-500',
    description:
      'You are energized by unstructured spaces where you can bring novel ideas to life, challenge norms, and convey emotion through design, words, audiovisuals, or immersive experiences.',
    traits: ['Creative', 'Intuitive', 'Expressive', 'Original', 'Independent', 'Aesthetic'],
    workVibe: 'Unconventional autonomy, creative freedom, visual & sonic innovation, and storytelling.',
    strengths: [
      'Generating out-of-the-box concepts that captivate audiences',
      'Visual, UX, interactive, and spatial aesthetic sensitivity',
      'Narrative craft, emotional resonance, and multimedia production',
      'Challenging standard assumptions with bold artistic perspectives',
    ],
  },
  L: {
    code: 'L',
    name: 'Leadership',
    archetype: 'The Leader',
    tagline: 'Ambition, persuasion, entrepreneurship, and driving impact',
    color: 'from-rose-500 to-orange-500',
    bgGrad: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderColor: 'border-rose-500',
    description:
      'Adapted from Holland’s Enterprising dimension, you are drawn to taking initiative, pitching bold visions, influencing groups, making decisions under uncertainty, and managing projects to win.',
    traits: ['Persuasive', 'Visionary', 'Strategic', 'Decisive', 'Charismatic', 'Ambitious'],
    workVibe: 'Dynamic dealmaking, pitch rooms, team rallies, startup sprints, and high-impact accountability.',
    strengths: [
      'Motivating diverse groups toward ambitious shared milestones',
      'Negotiation, stakeholder alignment, and venture storytelling',
      'Commercial acumen and risk-calculated decision making',
      'Spotting market trends and scaling scalable organizations',
    ],
  },
  I: {
    code: 'I',
    name: 'Investigative',
    archetype: 'The Analyst',
    tagline: 'Curiosity, scientific inquiry, logic, and deep problem-solving',
    color: 'from-cyan-400 to-blue-500',
    bgGrad: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    borderColor: 'border-cyan-500',
    description:
      'You possess relentless intellectual curiosity. You want to understand root causes, analyze complex datasets, test hypotheses, decode algorithms, and invent solutions to fundamental problems.',
    traits: ['Analytical', 'Inquisitive', 'Logical', 'Systematic', 'Intellectual', 'Objective'],
    workVibe: 'Deep-work focus, laboratories, algorithmic models, scientific papers, and high-signal research.',
    strengths: [
      'Deconstructing multifaceted puzzles into mathematical or empirical first principles',
      'Data science, machine learning models, and quantitative modeling',
      'Scientific research, hypothesis testing, and academic rigor',
      'Evaluating evidence without bias to uncover the ground truth',
    ],
  },
  P: {
    code: 'P',
    name: 'Practical',
    archetype: 'The Doer',
    tagline: 'Hands-on problem-solving, craftsmanship, machines, and physical realities',
    color: 'from-emerald-400 to-teal-500',
    bgGrad: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderColor: 'border-emerald-500',
    description:
      'Adapted from Holland’s Realistic dimension, you prefer working with tangible objects, hardware, tools, robotics, physical architecture, nature, or hands-on technology rather than abstract theory alone.',
    traits: ['Hands-On', 'Pragmatic', 'Resourceful', 'Tactile', 'Physical', 'Grounded'],
    workVibe: 'Workshops, engineering testbeds, outdoor sites, maker spaces, and visible tangible outcomes.',
    strengths: [
      'Rapid physical prototyping, hardware fabrication, and robotics integration',
      'Troubleshooting mechanical, electronic, or architectural breakdowns',
      'Fieldwork, outdoor sciences, environmental diagnostics, and spatial crafts',
      'Learning by tangible experimentation and direct tactile feedback',
    ],
  },
  S: {
    code: 'S',
    name: 'Social',
    archetype: 'The Helper',
    tagline: 'Empathy, mentoring, human potential, community, and service',
    color: 'from-violet-400 to-indigo-500',
    bgGrad: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    borderColor: 'border-violet-500',
    description:
      'You are genuinely fulfilled by elevating other human beings. You excel in communication, psychological insight, teaching, healthcare, counseling, and building inclusive, high-trust communities.',
    traits: ['Empathetic', 'Supportive', 'Patient', 'Communicative', 'Altruistic', 'Collaborative'],
    workVibe: 'Compassionate interactions, student mentorship, clinical care, mediation rooms, and advocacy groups.',
    strengths: [
      'Active listening and deep psychological empathy',
      'Instruction, workshop facilitation, and curriculum synthesis',
      'Conflict resolution, mediation, and community wellbeing',
      'Advocating for marginalized groups and human-centered design',
    ],
  },
};

export const CAREER_CLUSTERS = [
  'AI, Software & Frontier Technology',
  'Design, Media & Creative Economy',
  'Business Strategy, Fintech & Entrepreneurship',
  'Healthcare, BioTech & Psychological Sciences',
  'Engineering, Robotics & Clean Energy',
  'Public Policy, International Relations & Social Impact',
];

export const CAREERS_DATABASE: Career[] = [
  {
    id: 'ai-researcher',
    title: 'AI / Machine Learning Engineer',
    category: 'I',
    matchCodes: ['IAP', 'IPL', 'IAL', 'IAS', 'ICP', 'ILC'],
    cluster: 'AI, Software & Frontier Technology',
    description:
      'Build and train large language models, neural networks, and computer vision systems that solve complex automated challenges.',
    typicalDay: 'Formulate hypotheses, train transformer models, benchmark loss metrics, and write clean PyTorch/Python code.',
    salaryRange: 'PKR 4,800,000 - 66,000,000 / yr',
    growthOutlook: 'Explosive',
    entryMajors: ['Computer Science', 'Artificial Intelligence', 'Data Science', 'Applied Mathematics'],
    keySkills: ['Python & PyTorch', 'Linear Algebra & Calculus', 'Data Pipelines', 'Prompt Optimization', 'Model Fine-Tuning'],
  },
  {
    id: 'product-designer',
    title: 'Product (UI/UX) Designer',
    category: 'A',
    matchCodes: ['ASI', 'AIS', 'AIL', 'API', 'ALS', 'AIC'],
    cluster: 'Design, Media & Creative Economy',
    description:
      'Design digital experiences, mobile apps, and interactive products that are intuitive, visually breathtaking, and human-centric.',
    typicalDay: 'Interview users, map journey flows, prototype Figma animations, and collaborate with frontend developers.',
    salaryRange: 'PKR 3,200,000 - 44,000,000 / yr',
    growthOutlook: 'Very High',
    entryMajors: ['Interactive Design', 'Human-Computer Interaction (HCI)', 'Graphic Design', 'Cognitive Science'],
    keySkills: ['Figma Prototyping', 'User Research & Wireframing', 'Design Systems', 'Micro-Interactions', 'Information Architecture'],
  },
  {
    id: 'tech-founder',
    title: 'Venture Founder & Tech CEO',
    category: 'L',
    matchCodes: ['LIA', 'LIC', 'LAI', 'LSI', 'LIP', 'LCS'],
    cluster: 'Business Strategy, Fintech & Entrepreneurship',
    description:
      'Found and steer modern startups, recruit top tier talent, pitch to venture capitalists, and bring innovative products to market.',
    typicalDay: 'Pitching angel investors, mentoring tech teams, evaluating financial burn rates, and defining strategic product vision.',
    salaryRange: 'PKR 4,500,000 - 85,000,000+ / yr',
    growthOutlook: 'High',
    entryMajors: ['Business Administration', 'Computer Science & Management', 'Economics', 'Entrepreneurship'],
    keySkills: ['Visionary Storytelling', 'Fundraising & Valuation', 'Team Leadership', 'GTM Strategy', 'Resilience'],
  },
  {
    id: 'biotech-scientist',
    title: 'Bioinformatics & Gene Therapy Scientist',
    category: 'I',
    matchCodes: ['IPS', 'IPA', 'ISA', 'ISC', 'ICP', 'ILS'],
    cluster: 'Healthcare, BioTech & Psychological Sciences',
    description:
      'Analyze genomic datasets to discover targeted cancer cures, CRISPR therapies, and synthetic biology breakthroughs.',
    typicalDay: 'Run sequencing algorithms, interpret protein folding simulations, and review laboratory clinical trials.',
    salaryRange: 'PKR 3,500,000 - 48,000,000 / yr',
    growthOutlook: 'Very High',
    entryMajors: ['Bioinformatics', 'Molecular Biology', 'Biomedical Engineering', 'Genetics'],
    keySkills: ['Genomic Analysis', 'R & BioPython', 'Statistical Genetics', 'Lab Protocol', 'CRISPR Techniques'],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Threat Hunter & Defense Architect',
    category: 'C',
    matchCodes: ['CIP', 'CIL', 'CPI', 'CIA', 'CIS', 'CLP'],
    cluster: 'AI, Software & Frontier Technology',
    description:
      'Protect national infrastructure, financial networks, and consumer data from advanced state-sponsored cyberattacks.',
    typicalDay: 'Audit network packets, perform penetration testing, engineer zero-trust protocols, and respond to breaches.',
    salaryRange: 'PKR 3,600,000 - 51,000,000 / yr',
    growthOutlook: 'Explosive',
    entryMajors: ['Cybersecurity', 'Computer Networks', 'Information Systems', 'Software Engineering'],
    keySkills: ['Network Forensics', 'Penetration Testing (Kali)', 'Cryptography', 'SIEM & SOC Tools', 'Risk Compliance'],
  },
  {
    id: 'robotics-engineer',
    title: 'Autonomous Robotics & Mechatronics Engineer',
    category: 'P',
    matchCodes: ['PIC', 'PIA', 'PIL', 'PIS', 'PCI', 'PLC'],
    cluster: 'Engineering, Robotics & Clean Energy',
    description:
      'Design, build, and calibrate autonomous drones, humanoid robots, and surgical robotic systems.',
    typicalDay: 'Solder microcontrollers, simulate kinematics in ROS, test lidar sensors, and test physical prototypes in maker labs.',
    salaryRange: 'PKR 3,800,000 - 52,000,000 / yr',
    growthOutlook: 'Very High',
    entryMajors: ['Robotics Engineering', 'Mechanical Engineering', 'Mechatronics', 'Electrical Engineering'],
    keySkills: ['C++ & ROS 2', 'SolidWorks CAD', 'Microcontrollers & PCBs', 'Kinematics', 'Embedded Systems'],
  },
  {
    id: 'clinical-psychologist',
    title: 'Adolescent & Neurodivergence Psychologist',
    category: 'S',
    matchCodes: ['SIA', 'SIL', 'SIC', 'SAI', 'SLI', 'SCP'],
    cluster: 'Healthcare, BioTech & Psychological Sciences',
    description:
      'Support youth and adults through cognitive behavioral therapy, mental health guidance, and neurodiversity assessments.',
    typicalDay: 'Conduct 1-on-1 therapeutic sessions, formulate tailored mental health strategies, and administer psychometric tests.',
    salaryRange: 'PKR 2,400,000 - 41,000,000 / yr',
    growthOutlook: 'High',
    entryMajors: ['Psychology', 'Cognitive Science', 'Clinical Social Work', 'Neuroscience'],
    keySkills: ['Therapeutic Rapport', 'CBT/DBT Methodologies', 'Diagnostic Assessment', 'Crisis De-escalation', 'Empathy'],
  },
  {
    id: 'clean-energy-architect',
    title: 'Clean Energy & Climate Systems Engineer',
    category: 'P',
    matchCodes: ['PIL', 'PIC', 'PIA', 'PCL', 'PSI', 'IPL'],
    cluster: 'Engineering, Robotics & Clean Energy',
    description:
      'Develop next-generation solar grids, offshore wind turbines, battery storage systems, and carbon capture infrastructure.',
    typicalDay: 'Model grid capacity, run fluid dynamic simulations, inspect thermal storage modules, and optimize energy yields.',
    salaryRange: 'PKR 3,200,000 - 45,000,000 / yr',
    growthOutlook: 'Explosive',
    entryMajors: ['Sustainable Energy Engineering', 'Environmental Science', 'Electrical Engineering', 'Civil Engineering'],
    keySkills: ['Energy Modeling', 'Grid Architecture', 'Thermodynamics', 'Environmental Impact Assessment', 'GIS Mapping'],
  },
  {
    id: 'brand-director',
    title: 'Creative Director & Brand Strategist',
    category: 'A',
    matchCodes: ['ALI', 'ALS', 'ALC', 'ASI', 'AIC', 'ACL'],
    cluster: 'Design, Media & Creative Economy',
    description:
      'Define visual identity, viral culture campaigns, high-fashion styling, or entertainment narratives for global brands.',
    typicalDay: 'Moodboard concept design, lead photoshoots, guide copywriters, and pitch brand revamp campaigns to executive boards.',
    salaryRange: 'PKR 3,500,000 - 52,000,000 / yr',
    growthOutlook: 'High',
    entryMajors: ['Advertising & Brand Design', 'Fine Arts', 'Marketing Communication', 'Media Studies'],
    keySkills: ['Creative Direction', 'Typography & Palette Mastery', 'Storytelling', 'Campaign Pitching', 'Cultural Trend Forecasting'],
  },
  {
    id: 'fintech-analyst',
    title: 'Quantitative Trader & FinTech Strategist',
    category: 'C',
    matchCodes: ['CLI', 'CIL', 'CIP', 'CLA', 'CSL', 'LIC'],
    cluster: 'Business Strategy, Fintech & Entrepreneurship',
    description:
      'Apply mathematical algorithms, high-frequency execution pipelines, and blockchain systems to capital markets.',
    typicalDay: 'Backtest statistical arbitrage models, monitor financial risk exposures, and build automated execution scripts.',
    salaryRange: 'PKR 5,500,000 - 95,000,000+ / yr',
    growthOutlook: 'High',
    entryMajors: ['Quantitative Finance', 'Financial Engineering', 'Mathematics', 'Statistics & Economics'],
    keySkills: ['Algorithmic Modeling', 'Python/C++', 'Stochastic Calculus', 'Financial Risk Analytics', 'Portfolio Optimization'],
  },
  {
    id: 'human-rights-attorney',
    title: 'Public Interest & Tech Policy Attorney',
    category: 'L',
    matchCodes: ['LSI', 'LSC', 'LIS', 'LSA', 'LAI', 'SIC'],
    cluster: 'Public Policy, International Relations & Social Impact',
    description:
      'Advocate for human rights, ethical AI governance, digital privacy, and international climate agreements.',
    typicalDay: 'Draft policy briefs, litigate before appellate courts, interview affected communities, and negotiate treaties.',
    salaryRange: 'PKR 3,000,000 - 49,000,000 / yr',
    growthOutlook: 'High',
    entryMajors: ['Pre-Law', 'Political Science', 'Philosophy, Politics & Economics (PPE)', 'International Relations'],
    keySkills: ['Legal Research & Writing', 'Oral Argumentation', 'Statutory Interpretation', 'Diplomacy', 'Ethical Governance'],
  },
  {
    id: 'ux-researcher',
    title: 'Behavioral UX Researcher',
    category: 'S',
    matchCodes: ['SIA', 'SIC', 'SAL', 'SPL', 'SAI', 'ISC'],
    cluster: 'Design, Media & Creative Economy',
    description:
      'Decode human cognitive biases and behavioral patterns to help tech products feel delightful, accessible, and intuitive.',
    typicalDay: 'Run eye-tracking tests, conduct contextual inquiries, synthesize qualitative empathy maps, and advise designers.',
    salaryRange: 'PKR 3,200,000 - 42,000,000 / yr',
    growthOutlook: 'Very High',
    entryMajors: ['Cognitive Psychology', 'Anthropology', 'Human Factors Engineering', 'Sociology'],
    keySkills: ['Qualitative & Quantitative Research', 'Usability Testing', 'Empathy Mapping', 'Statistical Survey Design'],
  },
];

export const MAJORS_DATABASE: MajorProgram[] = [
  {
    id: 'cs',
    title: 'Computer Science & Software Systems',
    department: 'School of Computing & Engineering',
    primaryCodes: ['I', 'P', 'C'],
    degreeTypes: ['B.S.', 'B.Eng.', 'M.S.'],
    overview:
      'Foundational computer systems, data structures, algorithms, operating systems, and distributed web/cloud architectures.',
    coreSubjects: ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems', 'Software Engineering'],
    careerProspects: ['Software Architect', 'Cloud Infrastructure Engineer', 'Mobile App Developer', 'Systems Programmer'],
  },
  {
    id: 'ai-data',
    title: 'Artificial Intelligence & Data Science',
    department: 'School of Computing & Mathematical Sciences',
    primaryCodes: ['I', 'C', 'L'],
    degreeTypes: ['B.S.', 'M.S.'],
    overview:
      'Advanced statistical learning, neural networks, computer vision, natural language processing, and ethical machine intelligence.',
    coreSubjects: ['Machine Learning', 'Deep Learning & NLP', 'Probability & Statistics', 'Big Data Engineering', 'AI Ethics'],
    careerProspects: ['Machine Learning Engineer', 'Data Scientist', 'AI Product Manager', 'Computer Vision Researcher'],
  },
  {
    id: 'hci-design',
    title: 'Interaction Design & Human-Computer Interaction',
    department: 'School of Design & Creative Arts',
    primaryCodes: ['A', 'S', 'I'],
    degreeTypes: ['B.A.', 'B.F.A.', 'B.S.'],
    overview:
      'Merging visual aesthetics, user research, interface prototyping, and emerging spatial computing (AR/VR).',
    coreSubjects: ['Design Systems', 'Interaction Prototyping', 'User Experience Research', 'Visual Communication', 'Spatial UX'],
    careerProspects: ['Product Designer', 'Design System Architect', 'UX Researcher', 'AR/VR Experience Creator'],
  },
  {
    id: 'mechatronics-robotics',
    title: 'Robotics & Mechatronics Engineering',
    department: 'School of Engineering',
    primaryCodes: ['P', 'I', 'C'],
    degreeTypes: ['B.S.', 'B.Eng.'],
    overview:
      'Cross-disciplinary study of mechanical design, electronic sensors, microcontrollers, control theory, and autonomous behavior.',
    coreSubjects: ['Robotics Kinematics', 'Embedded Microcontrollers', 'Circuit Design', 'CAD Modeling', 'Control Systems'],
    careerProspects: ['Autonomous Systems Engineer', 'Robotics Hardware Developer', 'Automation Specialist', 'Drone Engineer'],
  },
  {
    id: 'biz-entrepreneurship',
    title: 'Business Innovation & Entrepreneurship',
    department: 'School of Business & Management',
    primaryCodes: ['L', 'C', 'S'],
    degreeTypes: ['B.B.A.', 'B.S.', 'M.B.A.'],
    overview:
      'Venture creation, corporate strategy, venture capital, digital marketing, negotiation, and high-growth leadership.',
    coreSubjects: ['Venture Capital & Finance', 'Strategic Management', 'Marketing & Brand Strategy', 'Organizational Leadership', 'Corporate Law'],
    careerProspects: ['Startup Founder', 'Product Manager', 'Management Consultant', 'Venture Capital Analyst'],
  },
  {
    id: 'biomed-sciences',
    title: 'Biomedical Sciences & Genetics',
    department: 'School of Medicine & Biological Sciences',
    primaryCodes: ['I', 'P', 'S'],
    degreeTypes: ['B.S.', 'M.D.-Ph.D. Track'],
    overview:
      'Cellular biology, human physiology, genomics, pharmacology, and drug discovery for tomorrow’s precision healthcare.',
    coreSubjects: ['Molecular Genetics', 'Biochemistry', 'Human Anatomy & Physiology', 'Immunology', 'Biostatistics'],
    careerProspects: ['Biomedical Researcher', 'Genetic Counselor', 'Pre-Medical Candidate', 'Clinical Trial Specialist'],
  },
  {
    id: 'cognitive-psych',
    title: 'Psychological Sciences & Behavioral Analytics',
    department: 'School of Social & Behavioral Sciences',
    primaryCodes: ['S', 'I', 'A'],
    degreeTypes: ['B.A.', 'B.S.'],
    overview:
      'Human cognition, developmental psychology, neurobiology, mental health intervention, and behavioral research methods.',
    coreSubjects: ['Cognitive Neuroscience', 'Developmental Psychology', 'Abnormal Psychology', 'Research Methods', 'Counseling Principles'],
    careerProspects: ['Clinical Psychologist (post-grad)', 'Behavioral Data Analyst', 'HR People Partner', 'School Counselor'],
  },
  {
    id: 'fin-quant',
    title: 'FinTech & Quantitative Economics',
    department: 'School of Economics & Finance',
    primaryCodes: ['C', 'I', 'L'],
    degreeTypes: ['B.S.', 'M.S.'],
    overview:
      'Modern financial markets, decentralized finance, econometrics, computational trading, and algorithmic risk modeling.',
    coreSubjects: ['Econometrics', 'Financial Derivatives', 'Computational Finance', 'Blockchain Architecture', 'Microeconomics'],
    careerProspects: ['Quantitative Trader', 'FinTech Product Lead', 'Investment Banker', 'Economic Policy Analyst'],
  },
  {
    id: 'environ-sustainability',
    title: 'Environmental Engineering & Clean Energy',
    department: 'School of Earth & Environmental Sciences',
    primaryCodes: ['P', 'I', 'S'],
    degreeTypes: ['B.S.', 'B.Eng.'],
    overview:
      'Renewable energy systems, ecological preservation, climate risk modeling, circular economy, and green infrastructure.',
    coreSubjects: ['Renewable Energy Technologies', 'Hydrology & Water Systems', 'Environmental Chemistry', 'Atmospheric Modeling', 'GIS'],
    careerProspects: ['Sustainability Consultant', 'Renewable Energy Project Manager', 'Environmental Engineer', 'Carbon Offset Auditor'],
  },
  {
    id: 'media-film',
    title: 'Digital Media, Film & Creative Arts',
    department: 'School of Arts & Humanities',
    primaryCodes: ['A', 'L', 'S'],
    degreeTypes: ['B.A.', 'B.F.A.'],
    overview:
      'Visual storytelling, digital cinematography, sound engineering, interactive games, and creative content production.',
    coreSubjects: ['Screenwriting & Narrative', 'Digital Cinematography', 'Sound Design & Scoring', 'Game Narrative', 'Creative Direction'],
    careerProspects: ['Creative Director', 'Film & Video Producer', 'Game Narrative Designer', 'Content Studio Founder'],
  },
];

export const ARCHETYPE_TITLES: Record<string, string> = {
  // Top 3-letter codes
  IAS: 'The Human-Centric Visionary',
  IAL: 'The Creative Tech Strategist',
  IAC: 'The Algorithmic Artisan',
  IAP: 'The Digital Inventor',
  IPA: 'The Hands-On Innovator',
  IPL: 'The Tech Founder & Maker',
  IPC: 'The Precision Systems Architect',
  IPS: 'The Bio-Engineering Healer',
  ILA: 'The Disruptive Frontier Leader',
  ILC: 'The Tech Executive',
  ILP: 'The Industrial Pioneer',
  ILS: 'The Thought Leader & Policy Reformer',
  ICA: 'The Architectural Modeler',
  ICP: 'The Cybersecurity Guardian',
  ICL: 'The Quant Intelligence Director',
  ICS: 'The Data Ethics Specialist',
  ISA: 'The Empathic Researcher',
  ISL: 'The Public Health Champion',
  ISP: 'The Clinical Practitioner',
  ISC: 'The Healthcare Systems Analyst',

  AIS: 'The Empathetic Storyteller',
  AIL: 'The Creative Agency Founder',
  AIC: 'The UX Architect',
  AIP: 'The Industrial Product Sculptor',
  ALI: 'The Creative Brand Director',
  ALS: 'The Cultural Movement Leader',
  ALC: 'The Executive Producer',
  ALP: 'The Immersive Stage Architect',
  ASI: 'The Human Experience Designer',
  ASL: 'The Community Arts Activist',
  ASP: 'The Expressive Craftsman',
  ASC: 'The Educational Media Creator',
  API: 'The Experimental Fabricator',
  APL: 'The Design-Build Entrepreneur',
  APC: 'The Visual Systems Crafter',
  APS: 'The Art Therapist & Mentor',
  ACI: 'The Interface Information Designer',
  ACL: 'The Creative Marketing Director',
  ACS: 'The Community Brand Curator',
  ACP: 'The Technical Animator & Modeler',

  LIA: 'The Innovation Catalyst',
  LIC: 'The High-Stakes Venture Operator',
  LIS: 'The Ethical Policy Strategist',
  LIP: 'The Hardware Venture Pioneer',
  LAI: 'The Visionary Brand Builder',
  LAS: 'The Charismatic Social Entrepreneur',
  LAC: 'The Modern Media Executive',
  LAP: 'The Experiential Producer',
  LSI: 'The Transformational Educator',
  LSA: 'The Public Impact Campaigner',
  LSC: 'The Institutional Director',
  LSP: 'The Operations Field Commander',
  LCI: 'The Strategic Chief of Staff',
  LCA: 'The Commerce Creative Director',
  LCS: 'The Corporate People Strategist',
  LCP: 'The Supply Chain Commander',
  LPI: 'The DeepTech Founder',
  LPA: 'The Creative Contractor',
  LPC: 'The Real Estate & Infrastructure Developer',
  LPS: 'The Community Builder & Field Leader',

  PIA: 'The Frontier Hardware Hacker',
  PIL: 'The Industrial Robotics Founder',
  PIC: 'The Mechatronic Systems Engineer',
  PIS: 'The Prosthetics & Bio-Fabricator',
  PAI: 'The Tangible Interaction Designer',
  PAL: 'The Creative Construction Maestro',
  PAC: 'The Architectural Artisan',
  PAS: 'The Eco-Community Builder',
  PLI: 'The Engineering Operations Director',
  PLA: 'The Practical Producer',
  PLC: 'The Project Site Superintendent',
  PLS: 'The Field Rescue & Action Leader',
  PCI: 'The Precision Mechanical Analyst',
  PCA: 'The Digital Fabrication Craftsman',
  PCL: 'The Infrastructure Program Manager',
  PCS: 'The Quality Assurance Inspector',
  PSI: 'The Rehabilitation Specialist',
  PSA: 'The Therapeutic Crafts Mentor',
  PSL: 'The Youth Technical Trainer',
  PSC: 'The Biomedical Operations Specialist',

  SIA: 'The Insightful Counselor',
  SIL: 'The Public Health Crusader',
  SIC: 'The Patient Data Specialist',
  SIP: 'The Occupational Healer',
  SAI: 'The Expressive Arts Therapist',
  SAL: 'The Social Impact Organizer',
  SAC: 'The Educational Curriculum Architect',
  SAP: 'The Community Outdoor Facilitator',
  SLI: 'The Educational Reformer',
  SLA: 'The Cultural Diversity Director',
  SLC: 'The Non-Profit Executive Director',
  SLP: 'The Youth Sports & Leadership Coach',
  SCI: 'The Clinical Research Coordinator',
  SCA: 'The Museum Experience Educator',
  SCL: 'The School Principal / Dean',
  SCP: 'The Community Health Worker',
  SPI: 'The Adaptive Tech Specialist',
  SPA: 'The Hands-On Youth Mentor',
  SPL: 'The Emergency Response Commander',
  SPC: 'The Healthcare Clinic Manager',

  CIA: 'The Information Architect',
  CIL: 'The Financial Risk Director',
  CIP: 'The Cybersecurity Sentinel',
  CIS: 'The Medical Records Director',
  CAI: 'The Systematic UI/UX Architect',
  CAL: 'The Creative Agency Comptroller',
  CAC: 'The Digital Asset Manager',
  CAS: 'The Non-Profit Financial Steward',
  CLI: 'The FinTech Chief Compliance Officer',
  CLA: 'The Commercial Contract Negotiator',
  CLC: 'The Corporate Operations Officer',
  CLS: 'The Human Resources Administrator',
  CPI: 'The Systems Quality Engineer',
  CPA: 'The Precision Drafting Specialist',
  CPL: 'The Logistics Network Director',
  CPS: 'The Environmental Safety Coordinator',
  CSI: 'The Healthcare Privacy Officer',
  CSA: 'The Academic Registrar & Advisor',
  CSL: 'The University Admissions Director',
  CSP: 'The Hospital Operations Dispatcher',
};

export function getCalipsInfo(category: CalipsCategory): CalipsCategoryInfo {
  return CALIPS_CATEGORIES[category];
}

export function getArchetypeTitle(pathCode: string): string {
  if (ARCHETYPE_TITLES[pathCode]) {
    return ARCHETYPE_TITLES[pathCode];
  }
  const first = CALIPS_CATEGORIES[pathCode[0] as CalipsCategory]?.archetype || 'Explorer';
  const second = CALIPS_CATEGORIES[pathCode[1] as CalipsCategory]?.archetype || 'Strategist';
  return `The ${first}-${second} Hybrid`;
}

export function calculatePathCode(scores: Record<CalipsCategory, number>): {
  pathCode: string;
  ranked: { category: CalipsCategory; score: number; percentage: number }[];
} {
  const categories: CalipsCategory[] = ['C', 'A', 'L', 'I', 'P', 'S'];
  const ranked = categories
    .map((cat) => ({
      category: cat,
      score: scores[cat] || 0,
      percentage: Math.round(((scores[cat] || 0) / 10) * 100),
    }))
    .sort((a, b) => b.score - a.score);

  const pathCode = ranked
    .slice(0, 3)
    .map((item) => item.category)
    .join('');

  return { pathCode, ranked };
}

export function getMatchedCareers(pathCode: string): Career[] {
  const letters = pathCode.split('') as CalipsCategory[];
  const primary = letters[0];
  const secondary = letters[1];

  return CAREERS_DATABASE.filter((career) => {
    // Exact or partial match
    if (career.matchCodes.includes(pathCode)) return true;
    if (career.category === primary) return true;
    if (career.category === secondary) return true;
    return false;
  }).slice(0, 6);
}

export function getMatchedMajors(pathCode: string): MajorProgram[] {
  const letters = pathCode.split('') as CalipsCategory[];
  return MAJORS_DATABASE.filter((major) =>
    major.primaryCodes.some((code) => letters.includes(code))
  ).slice(0, 5);
}

export function getRecommendedSkills(pathCode: string): { hardSkills: string[]; humanSkills: string[] } {
  const letters = pathCode.split('') as CalipsCategory[];
  const hardMap: Record<CalipsCategory, string[]> = {
    C: ['Data Modeling & SQL', 'Risk Assessment & Auditing', 'Project Management (Scrum/Agile)', 'Financial Accounting'],
    A: ['Figma / Adobe Creative Suite', 'Storyboarding & Video Editing', 'Prompt & Visual Aesthetics', 'Creative Writing'],
    L: ['Pitching & Storytelling', 'Financial Modeling & Valuation', 'Public Speaking', 'Product Roadmap Strategy'],
    I: ['Python & Data Science', 'Mathematical Logic & Statistics', 'Scientific Method & Experimentation', 'Algorithmic Problem-Solving'],
    P: ['CAD & 3D Prototyping', 'Circuitry & Microcontrollers', 'Hardware Diagnostic Tooling', 'Materials Engineering'],
    S: ['Active Listening & Mediation', 'Empathic Interviewing', 'Instructional Facilitation', 'Conflict Resolution'],
  };

  const humanMap: Record<CalipsCategory, string[]> = {
    C: ['Unwavering Consistency', 'Attention to Edge Cases', 'Integrity under Pressure', 'Organization Stamina'],
    A: ['Fearless Originality', 'Vulnerability in Expression', 'Visual Nuance', 'Openness to Ambiguity'],
    L: ['Decisiveness in Ambiguity', 'Motivational Charisma', 'Strategic Resilience', 'High Accountability'],
    I: ['Intellectual Humility', 'Rigor & Skepticism', 'First-Principles Reasoning', 'Deep Focus & Patience'],
    P: ['Pragmatic Resourcefulness', 'Tactile Spatial Reasoning', 'Grounded Common Sense', 'Perseverance'],
    S: ['Radical Empathy', 'Patience & Compassion', 'Cultural Awareness', 'Trust Building'],
  };

  const hardSkills: string[] = [];
  const humanSkills: string[] = [];

  letters.forEach((cat) => {
    if (hardMap[cat]) hardSkills.push(...hardMap[cat].slice(0, 2));
    if (humanMap[cat]) humanSkills.push(...humanMap[cat].slice(0, 2));
  });

  return {
    hardSkills: Array.from(new Set(hardSkills)),
    humanSkills: Array.from(new Set(humanSkills)),
  };
}
