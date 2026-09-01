export const lotusExperience = {
  role: 'Research and Development Specialist',
  org: 'Intelligent Micronano Sensors (Lotus IMNS)',
  period: 'Since May 2024',
  summary:
    'Experimental micro/nano fabrication and multiphysics simulation for AFM sensors and microneedle drug-delivery patches, with ML-oriented process datasets.',
  projects: [
    {
      title: 'AFM Sensor Development',
      points: [
        'Analyzed fabrication data in Python and conducted multiphysics simulations in COMSOL to optimize sensor performance.',
        'Calculated KOH etch times from anisotropic etch-rate data (41.7% KOH, 75–85 °C) so that cantilevers and high-aspect-ratio tips (~15–21 µm) release during tip etching — no oxidation furnace required.',
        'Built an interactive MEMS etch-process simulator (React) to explore etch-time and process-parameter effects starting from mask designs.',
        'Structured datasets to support machine-learning-driven process improvements.',
        'Designed and fabricated AFM sensors on silicon wafers using UV lithography, RIE, and wet etching.',
        'Deposited gold thin films via PVD for functional surface enhancement.',
        'Engineered high-aspect-ratio tips through iterative process optimization, improving tip sharpness and release yield.',
        'Performed structural and surface characterization using SEM, AFM, and optical microscopy.',
        'Created mask designs using CorelDraw.',
      ],
      flow: ['Silicon Wafer', 'UV Lithography', 'RIE · Wet Etching', 'PVD Gold', 'High-Aspect-Ratio Tips', 'SEM / AFM / Optical Char.'],
    },
    {
      title: 'Microneedle Patch Development',
      points: [
        'Fabricated PDMS molds from silicon microneedle masters using microfabrication techniques.',
        'Optimized hydroxyapatite (HA) loading via centrifugation.',
        'Engineered PVP formulations for transparent, mechanically robust patches.',
        'Conducted formulation R&D, improving flexibility and reducing brittleness through iterative testing.',
        'Created centrifuge part designs using CATIA.',
      ],
      flow: ['Silicon Master', 'PDMS Mold', 'Polymer Formulation', 'Centrifugation', 'Microneedle Patch'],
    },
  ],
  tags: ['UV Lithography', 'RIE', 'PVD', 'SEM', 'AFM', 'COMSOL', 'Python', 'PDMS', 'CATIA'],
}

export interface EducationItem {
  degree: string
  field: string
  school: string
  period: string
  gpa: string
  highlight?: boolean
  courses: { name: string; grade: string }[]
}

export const education: EducationItem[] = [
  {
    degree: 'M.Sc.',
    field: 'Particle Physics and Field Theory',
    school: 'Shahid Beheshti University, Tehran',
    period: '2021 – 2024',
    gpa: '14.13 / 20',
    highlight: true,
    courses: [
      { name: 'Quantum Field Theory II', grade: '18.23/20' },
      { name: 'Gravity I', grade: '17/20' },
      { name: 'Advanced Quantum Mechanics', grade: '16.02/20' },
      { name: 'Advanced Statistical Mechanics', grade: '15.9/20' },
      { name: 'Geometry and Topology', grade: '15/20' },
    ],
  },
  {
    degree: 'B.Sc.',
    field: 'Physics',
    school: 'Alzahra University, Tehran',
    period: '2017 – 2021',
    gpa: '15.66 / 20',
    courses: [
      { name: 'Numerical Calculations', grade: '4/4' },
      { name: 'Stochastic Processes', grade: '4/4' },
      { name: 'Advanced Quantum Mechanics I', grade: '4/4' },
      { name: 'Computer Programming (Theoretical & Practical)', grade: '4/4' },
    ],
  },
  {
    degree: 'Diploma',
    field: 'Mathematics and Physics',
    school: 'Motahare High School',
    period: '2013 – 2016',
    gpa: '19.38 / 20',
    courses: [],
  },
]
