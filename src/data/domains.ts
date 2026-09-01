export interface Certification {
  name: string
  issuer: string
  date: string
}

export const certifications: Certification[] = [
  { name: 'SANS SEC505', issuer: 'LIAN Group', date: 'Sep 2025' },
  { name: 'Network+', issuer: 'LIAN Group', date: 'Sep 2025' },
  { name: 'Security+', issuer: 'LIAN Group', date: 'Sep 2025' },
  { name: 'Certified Ethical Hacker (CEH)', issuer: 'Maktabkhooneh Jadi’s course', date: 'Jul 2025' },
  { name: 'Software Test Bootcamp (SQL Server & Oracle)', issuer: 'Behpardaz Hamrah Samaneh Aval Behsa', date: 'May 2024' },
  { name: 'DESY Remote Summer School — data analysis, ML, HPC (Python, C++, Fortran)', issuer: 'DESY', date: '2023' },
  { name: 'Greedy Algorithms, MST & Dynamic Programming', issuer: 'Stanford University · Coursera', date: '2023' },
  { name: 'Workshop on Stochastic Thermodynamics', issuer: 'ICTP', date: 'May 2023' },
  { name: 'Applied Machine Learning in Python', issuer: 'University of Michigan · Coursera', date: 'Oct 2022' },
  { name: 'Workshop on Topological Data Analysis', issuer: 'Shahid Beheshti University', date: 'Aug 2022' },
  { name: 'Python Course', issuer: 'Alzahra University', date: 'Oct 2021' },
  { name: 'Introduction to C · Introduction to C# · Intermediate SQL', issuer: 'SoloLearn', date: '' },
]

export interface SkillGroup {
  title: string
  visible: string[]
  extra: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Programming',
    visible: ['Python', 'C', 'C++', 'SQL', 'JavaScript'],
    extra: ['C#', 'Fortran', 'MATLAB'],
  },
  {
    title: 'Machine Learning',
    visible: ['TensorFlow', 'Keras', 'Scikit-learn', 'OpenCV'],
    extra: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
  },
  {
    title: 'Scientific Computing',
    visible: ['COMSOL', 'STAR-CCM+', 'Monte Carlo'],
    extra: ['Rivet (Docker)', 'Docker', 'SPH', 'Stochastic Differential Equations'],
  },
  {
    title: 'IoT & Embedded',
    visible: ['MQTT', 'LoRaWAN', 'Node-RED', 'Node.js', 'Raspberry Pi'],
    extra: ['TinyML — quantization & pruning', 'SSH / remote deployment'],
  },
  {
    title: 'Databases',
    visible: ['SQL Server', 'Oracle', 'SQLite', 'MySQL'],
    extra: ['Data pipelines', 'Schema design'],
  },
  {
    title: 'Design & Creative',
    visible: ['CATIA', 'CorelDRAW', 'Adobe Illustrator'],
    extra: ['AutoCAD', 'Adobe InDesign', 'Photoshop', 'Lightroom', '3ds Max'],
  },
  {
    title: 'Version Control',
    visible: ['Git', 'GitHub'],
    extra: [],
  },
]

export interface ResearchDomain {
  id: string
  title: string
  items: string[]
}

export const researchDomains: ResearchDomain[] = [
  {
    id: 'fabrication',
    title: 'Micro/Nano Fabrication',
    items: ['Silicon wafer processing', 'UV lithography', 'RIE', 'Wet chemical etching', 'PVD', 'AFM sensor fabrication', 'MEMS structures', 'High-aspect-ratio structures', 'SEM / AFM characterization'],
  },
  {
    id: 'sensors',
    title: 'Intelligent Sensors',
    items: ['AFM sensors', 'Sensor data analysis', 'Sensor optimization', 'TinyML', 'Low-power deployment', 'Intelligent sensing systems'],
  },
  {
    id: 'iot',
    title: 'IoT & Embedded Systems',
    items: ['LoRaWAN', 'MQTT', 'Node.js', 'Node-RED', 'Raspberry Pi', 'Real-time telemetry', 'Sensor networks', 'Monitoring systems'],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    items: ['Supervised learning', 'Unsupervised learning', 'Neural networks', 'CNN / RNN / LSTM', 'GCN', 'Autoencoders', 'Anomaly detection', 'Clustering', 'Feature engineering', 'TinyML'],
  },
  {
    id: 'sci-comp',
    title: 'Scientific Computing',
    items: ['Numerical simulations', 'Monte Carlo methods', 'Stochastic processes', 'Stochastic differential equations', 'High-performance computing', 'Computational physics', 'CFD / SPH', 'Rivet', 'COMSOL'],
  },
  {
    id: 'physics',
    title: 'Physics',
    items: ['Quantum field theory', 'Particle physics', 'Statistical mechanics', 'Quantum mechanics', 'Stochastic thermodynamics', 'Topological data analysis'],
  },
]

export const aboutNarrative = [
  'My work begins where theory meets hardware. Trained in particle physics and quantum field theory at Shahid Beheshti University, I moved from analytical models to numerical simulation — Monte Carlo methods, stochastic differential equations, and high-performance computing in C++, Python, and Fortran.',
  'At Lotus IMNS I moved into the cleanroom: fabricating AFM cantilever sensors on silicon wafers with UV lithography, RIE, and wet etching, depositing PVD gold films, and engineering high-aspect-ratio tips — while running COMSOL multiphysics simulations and building Python datasets structured for machine-learning-driven process optimization.',
  'In parallel, I build connected systems. At the Iran IoT Expansion Center I designed a smart health-monitoring platform — simulated LoRa wearables streaming GPS, blood-pressure, SpO₂, and fall-detection telemetry over MQTT through a Node.js pipeline into SQL, surfaced in a real-time web dashboard.',
  'Machine learning is the thread that ties these together: TinyML models optimized for low-power hardware, graph neural networks for complex systems, physics-informed symbolic regression that recovers physical laws from data, predictive-maintenance platforms that separate machine faults from sensor faults, autoencoders for anomaly detection, and topological data analysis for the structure hidden in high-dimensional data.',
]
