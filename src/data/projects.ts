/** Real, verified public GitHub repositories (source: GitHub API, user Parisadghn). */
export const knownRepos = [
  {
    name: 'confusion-scheme',
    html_url: 'https://github.com/Parisadghn/confusion-scheme',
    description: 'Determining the phase transition of Ising model.',
    language: 'C++',
    topics: ['Monte Carlo', 'Statistical Mechanics'],
  },
  {
    name: 'laptop-price-ML',
    html_url: 'https://github.com/Parisadghn/laptop-price-ML',
    description: 'Machine learning notebook project.',
    language: 'Jupyter Notebook',
    topics: ['Machine Learning'],
  },
]

export type ProjectCategory =
  | 'Machine Learning'
  | 'Physics'
  | 'Scientific Computing'
  | 'IoT'
  | 'Simulation'
  | 'Data Science'
  | 'Algorithms'

export interface Project {
  title: string
  categories: ProjectCategory[]
  flagship?: boolean
  description: string
  detail?: string[]
  tech: string[]
  link?: string
  linkLabel?: string
  viz?: 'bubbles' | 'graph' | 'lattice' | 'chart' | 'autoencoder' | 'persistence' | 'detector' | 'pipeline' | 'equation' | 'twin' | 'band'
}

export const projectCategories: ('All' | ProjectCategory)[] = [
  'All',
  'Machine Learning',
  'Physics',
  'Scientific Computing',
  'IoT',
  'Simulation',
  'Data Science',
  'Algorithms',
]

export const projects: Project[] = [
  // ── Flagship ────────────────────────────────────────────────
  {
    title: 'Environmental Monitoring',
    categories: ['IoT', 'Machine Learning'],
    flagship: true,
    description:
      'Real-time sensor data analysis model deployed on a Raspberry Pi with high energy efficiency.',
    detail: ['Pipeline: Raspberry Pi → Sensors → Data Processing → ML / Analysis → Results.', 'Emphasis on low-power operation and on-device deployment.'],
    tech: ['Raspberry Pi', 'Python', 'TinyML', 'Sensor data analysis'],
    viz: 'pipeline',
  },
  {
    title: 'Bubble Rise Simulation',
    categories: ['Simulation', 'Scientific Computing'],
    flagship: true,
    description: 'SPH + STAR-CCM+ + Python: simulation and analysis of micron-sized bubble rise dynamics.',
    detail: [
      'Developed a Python SPH (smoothed-particle hydrodynamics) model.',
      'Wrote an automated STAR-CCM+ macro for scaled CFD modeling.',
      'Compared results against theoretical predictions.',
      'Automated data export and analysis pipeline.',
    ],
    tech: ['Python', 'SPH', 'STAR-CCM+', 'CFD', 'Automation'],
    viz: 'bubbles',
  },
  {
    title: 'Graph Convolutional Networks',
    categories: ['Machine Learning', 'Physics'],
    flagship: true,
    description: 'Authored a research paper on GCNs and their applications in complex systems.',
    detail: ['Graph neural networks operating on irregular, relational structure.', 'Applications to complex-system analysis.'],
    tech: ['GCN', 'Graph Neural Networks', 'Complex Systems'],
    link: '[ADD PAPER LINK]',
    linkLabel: 'Paper',
    viz: 'graph',
  },
  {
    title: 'Phase Transition in the Ising Model',
    categories: ['Physics', 'Simulation'],
    flagship: true,
    description: 'Metropolis Monte Carlo with scrambling to determine phase transitions in the 2D Ising model.',
    detail: [
      'Implemented the Metropolis Monte Carlo algorithm.',
      'Lattice evolves from ordered to disordered states across the critical temperature.',
      'Extended into an interactive "Learning by Confusion" dashboard — a neural network detects the phase transition without knowing the order parameter (van Nieuwenburg et al., Nature Physics 2017).',
      'Open-source implementation on GitHub.',
    ],
    tech: ['Monte Carlo', 'Metropolis', 'Statistical Mechanics', 'Neural Networks', 'C++'],
    link: 'https://github.com/Parisadghn/confusion-scheme',
    linkLabel: 'GitHub',
    viz: 'lattice',
  },
  {
    title: 'Topological Data Analysis',
    categories: ['Data Science', 'Machine Learning', 'Physics'],
    flagship: true,
    description: 'Persistent homology and Mapper algorithms applied to biological and network data.',
    detail: ['Pipeline: point cloud → filtration → persistence diagram.', 'Tools: GUDHI, Dionysus, JavaPlex.'],
    tech: ['Persistent Homology', 'Mapper', 'GUDHI', 'Dionysus', 'JavaPlex'],
    viz: 'persistence',
  },
  {
    title: 'Stock Price Prediction',
    categories: ['Machine Learning', 'Data Science'],
    flagship: true,
    description: 'RNN with stacked LSTM and Bidirectional LSTM layers for stock price forecasting.',
    detail: ['Architecture: RNN → LSTM → Bidirectional LSTM.'],
    tech: ['Python', 'RNN', 'LSTM', 'TensorFlow', 'Keras'],
    viz: 'chart',
  },
  {
    title: 'Anomaly Detection',
    categories: ['Machine Learning', 'Data Science'],
    flagship: true,
    description: 'Autoencoder neural network to detect fraudulent financial transactions.',
    detail: ['Architecture: Input → Encoder → Latent Space → Decoder → Reconstruction Error.', 'Transactions with high reconstruction error are flagged as anomalies.'],
    tech: ['Autoencoder', 'Neural Networks', 'TensorFlow', 'Keras'],
    viz: 'autoencoder',
  },
  {
    title: 'Particle Accelerator Simulation',
    categories: ['Physics', 'Simulation'],
    flagship: true,
    description: 'Simulated high-energy physics processes using the Rivet analysis framework in Docker.',
    detail: ['Pipeline: physics event → simulation → data → analysis.'],
    tech: ['Rivet', 'Docker', 'High-Energy Physics', 'C++'],
    viz: 'detector',
  },
  {
    title: 'Image Classification (TinyML)',
    categories: ['Machine Learning', 'IoT'],
    flagship: true,
    description: 'Neural network optimized with quantization and pruning: 50% model-size reduction at >90% accuracy.',
    tech: ['TensorFlow', 'Quantization', 'Pruning', 'TinyML'],
    viz: 'pipeline',
  },
  {
    title: 'Physics-Informed Symbolic Regression (pisr)',
    categories: ['Machine Learning', 'Physics', 'Scientific Computing'],
    flagship: true,
    description:
      'Symbolic regression without a language model: dimensional analysis and π-group reduction replace LLM-based physics knowledge, with EFT-style basis generation, sparse regression, and a 27k-parameter tree scorer.',
    detail: [
      'Recovers known physical laws exactly as single-term equations — e.g. √(2gh) for free fall, A·cos(√(k/m)·t + φ) for SHM, damped plane waves.',
      'Candidate selection by description length (MDL) instead of tuned loss weights.',
      'Benchmarked on AI-Feynman / PMLB equations with exact structural recovery on the majority of problems, plus a noise-robustness sweep.',
    ],
    tech: ['Python', 'Symbolic Regression', 'Dimensional Analysis', 'MDL', 'PyTorch'],
    link: '[ADD PROJECT LINK]',
    linkLabel: 'Repository',
    viz: 'equation',
  },
  {
    title: 'NeuroTwin — Sensor-Health & Predictive-Maintenance Platform',
    categories: ['Machine Learning', 'IoT', 'Scientific Computing'],
    flagship: true,
    description:
      'C#/.NET prognostics platform that decouples machine faults from sensor faults using physics-motivated signal features, statistical anomaly detectors, and digital-twin residuals — with RUL estimation and explainable diagnosis.',
    detail: [
      'Zero-dependency scientific core: radix-2 FFT, sliding-window features, multivariate detectors, health index, RUL with confidence interval.',
      'Sensor self-diagnosis for seven fault modes (bias, gain, drift, noise, dropout, saturation, stuck-at) with fault-origin attribution.',
      'REST API + real-time worker, Docker deployment, 33 automated tests; benchmark hooks for NASA C-MAPSS and CaDDE 2026.',
    ],
    tech: ['C#', '.NET', 'Digital Twin', 'Anomaly Detection', 'RUL', 'Docker'],
    link: '[ADD PROJECT LINK]',
    linkLabel: 'Repository',
    viz: 'twin',
  },
  {
    title: 'TFET Device Physics Simulator',
    categories: ['Simulation', 'Scientific Computing'],
    flagship: true,
    description:
      'Interactive tunnel-FET simulator reproducing p-i-n silicon TFET transfer characteristics and energy-band diagrams, with COMSOL simulation-script generation from live device parameters.',
    detail: [
      'Tunable device parameters: channel length, EOT, gate work function, geometry presets.',
      'Band-diagram lab and architecture explorer across TFET geometries.',
      'Generates ready-to-run COMSOL guides and scripts from the current parameter set.',
    ],
    tech: ['React', 'TypeScript', 'Semiconductor Physics', 'COMSOL'],
    link: '[ADD PROJECT LINK]',
    linkLabel: 'Repository',
    viz: 'band',
  },
  // ── Compact cards ───────────────────────────────────────────
  {
    title: 'MEMS Etch-Process Simulator',
    categories: ['Simulation', 'Scientific Computing'],
    description: 'Interactive web app simulating KOH etch processes from mask designs and process parameters — built from my own AFM fabrication process data.',
    tech: ['React', 'Etch-Rate Modeling', 'MEMS'],
  },
  {
    title: 'Sentiment Analysis',
    categories: ['Machine Learning', 'Data Science'],
    description: 'Naive Bayes classifier applied to Snapfood reviews.',
    tech: ['Python', 'Naive Bayes', 'NLP'],
  },
  {
    title: 'Cryptocurrency Classification',
    categories: ['Machine Learning', 'Data Science'],
    description: 'KMeans clustering to classify cryptocurrencies and analyze market trends.',
    tech: ['KMeans', 'Clustering', 'Scikit-learn'],
  },
  {
    title: 'Breast Cancer Detection',
    categories: ['Machine Learning', 'Data Science'],
    description: 'Unsupervised machine learning for early detection of breast cancer.',
    tech: ['Scikit-learn', 'Clustering', 'Dimensionality Reduction'],
  },
  {
    title: 'MRI Image Analysis',
    categories: ['Machine Learning', 'Data Science'],
    description: 'Identified structural brain disorder differences using advanced image processing techniques.',
    tech: ['OpenCV', 'Image Processing', 'Python'],
  },
  {
    title: 'Stochastic Thermodynamics',
    categories: ['Physics', 'Simulation'],
    description: 'Numerical simulations of stochastic differential equations for molecular motors and nanoscale engines.',
    tech: ['SDEs', 'Numerical Methods', 'Python'],
  },
  {
    title: 'Hamshahri Newspaper Dataset',
    categories: ['Data Science'],
    description: 'Comprehensive data processing, visualization, and feature engineering on a Persian text corpus.',
    tech: ['Pandas', 'Feature Engineering', 'Visualization'],
  },
  {
    title: 'Knapsack Problem',
    categories: ['Algorithms'],
    description: 'Dynamic programming solution for resource allocation optimization.',
    tech: ['Dynamic Programming', 'C++'],
  },
  {
    title: 'Huffman Coding',
    categories: ['Algorithms'],
    description: 'Data compression algorithm, reducing file sizes by up to 30%.',
    tech: ['Greedy Algorithms', 'Trees', 'C++'],
  },
  {
    title: 'Minimum Spanning Tree',
    categories: ['Algorithms'],
    description: "Kruskal's algorithm applied to optimize network design efficiency by 20%.",
    tech: ['Graph Algorithms', "Kruskal's", 'C++'],
  },
  {
    title: 'Library Management System',
    categories: ['Algorithms'],
    description: 'OOP-based system showcasing class design and inheritance.',
    tech: ['OOP', 'C#'],
  },
  {
    title: 'To-Do List Application',
    categories: ['Algorithms'],
    description: 'Task management tool using arrays and file handling.',
    tech: ['C#', 'File Handling'],
  },
  {
    title: 'Calculator Application',
    categories: ['Algorithms'],
    description: 'Basic calculator built to practice control structures and methods.',
    tech: ['C#'],
  },
]
