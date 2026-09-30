import type { GalleryImage } from './content'

export interface ProjectStat {
  value: string
  label: string
}

export interface LotusProject {
  title: string
  eyebrow: string
  lede: string
  stats: ProjectStat[]
  points: string[]
  flow?: string[]
  gallery?: GalleryImage[]
}

export const lotusExperience: {
  role: string
  org: string
  period: string
  summary: string
  projects: LotusProject[]
  tags: string[]
} = {
  role: 'Research and Development Specialist',
  org: 'Intelligent Micronano Sensors (Lotus IMNS)',
  period: 'Since May 2024',
  summary:
    'Experimental micro/nano fabrication and multiphysics simulation for AFM sensors and microneedle drug-delivery patches, with ML-oriented process datasets.',
  projects: [
    {
      title: 'AFM Sensor Development',
      eyebrow: 'Case 01 · MEMS — Cleanroom Fabrication',
      lede: 'End-to-end design and fabrication of silicon AFM probes — from mask layout to released high-aspect-ratio tips — validated by SEM and AFM metrology.',
      stats: [
        { value: '~500', label: 'sensors / wafer' },
        { value: '<100>', label: 'n-type silicon' },
        { value: '15–21 µm', label: 'released tip height' },
        { value: '41.7%', label: 'KOH etch bath' },
      ],
      points: [
        'Led the design and execution of a complete silicon-based AFM probe fabrication flow as an R&D specialist.',
        'Patterned approximately 500 AFM sensors per silicon wafer through clean-room UV lithography, dry RIE, and KOH/BHF wet etching.',
        'Processed sensors on <100> n-type silicon with high-temperature oxidation and gold coating by PVD.',
        'Designed mass, cantilever, and tip mask layouts with a layout editor—not CorelDraw.',
        'Calculated KOH etch times from anisotropic etch-rate data (41.7% KOH, 75–85 °C) so that cantilevers and high-aspect-ratio tips (~15–21 µm) release during tip etching — no oxidation furnace required.',
        'Built a machine-learning model from R&D data to estimate process times, including etching time, from wafer characteristics.',
        'Built an interactive MEMS etch-process simulator (React) to explore etch-time and process-parameter effects starting from mask designs.',
        'Analyzed fabrication data in Python and conducted multiphysics simulations in COMSOL to optimize sensor performance.',
        'Deposited gold thin films via PVD for functional surface enhancement.',
        'Engineered high-aspect-ratio tips through iterative process optimization, improving tip sharpness and release yield.',
        'Performed structural and surface characterization using SEM, AFM, and optical microscopy.',
      ],
      flow: ['Mask Layout', 'Silicon Wafer', 'UV Lithography', 'RIE · Wet Etching', 'PVD Gold', 'High-Aspect-Ratio Tips', 'SEM / AFM / Optical Char.'],
      gallery: [
        {
          src: 'images/afm/wafer-sensors.jpg',
          alt: 'Gloved hand holding a silicon wafer patterned with rows of AFM sensors',
          caption: 'Silicon wafer with approximately 500 AFM sensors',
        },
        {
          src: 'images/afm/mask-stack.jpg',
          alt: 'Circular cantilever, tip, and mass masks stacked above a silicon wafer',
          caption: 'Cantilever, tip, and mass masks for a <100> n-type wafer, designed with a layout editor',
        },
        {
          src: 'images/afm/sem-cantilever-tip.jpg',
          alt: 'SEM images of a released AFM cantilever and a high-aspect-ratio tip',
          caption: 'Released cantilever and high-aspect-ratio tip, about 15–21 µm',
        },
        {
          src: 'images/afm/surface-scan.jpg',
          alt: 'Three-dimensional AFM surface topography with line-profile measurement plots',
          caption: 'Surface-scan validation of fabricated features',
        },
      ],
    },
    {
      title: 'Microneedle Patch Development',
      eyebrow: 'Case 02 · BioMEMS — Drug Delivery',
      lede: 'Dissolving microneedle patches cast from microfabricated silicon masters — HA-loaded tips on a flexible PVP backing for transdermal delivery.',
      stats: [
        { value: 'Si masters', label: 'microfabricated' },
        { value: 'PDMS', label: 'soft molds' },
        { value: 'HA + PVP', label: 'patch formulation' },
        { value: 'SEM', label: 'validated each step' },
      ],
      points: [
        'Fabricated PDMS molds from silicon microneedle masters using microfabrication techniques.',
        'Designed diamond and triangular microneedle mask layouts with a layout editor.',
        'Optimized hydroxyapatite (HA) loading via centrifugation.',
        'Engineered PVP formulations for transparent, mechanically robust patches.',
        'Conducted formulation R&D, improving flexibility and reducing brittleness through iterative testing.',
        'Characterized silicon masters, wafer-scale needle arrays, and HA/PVP patches by SEM.',
        'Created centrifuge part designs using CATIA.',
      ],
      flow: ['Mask Layout', 'Silicon Master', 'PDMS Mold', 'Polymer Formulation', 'Centrifugation', 'Microneedle Patch'],
      gallery: [
        {
          src: 'images/microneedle/sem-masters.png',
          alt: 'SEM images of silicon microneedle master cavities',
          caption: 'Silicon microneedle masters in SEM',
        },
        {
          src: 'images/microneedle/mask-design.png',
          alt: 'Black photomask squares containing diamond and triangular openings',
          caption: 'Diamond and triangular mask layouts, made with a layout editor',
        },
        {
          src: 'images/microneedle/wafer-array-sem.png',
          alt: 'SEM image of conical microneedles arrayed across a silicon wafer',
          caption: 'Wafer-scale microneedle array in SEM',
        },
        {
          src: 'images/microneedle/pvp-backing-sem.png',
          alt: 'Top-view SEM of microneedle tips embedded in a PVP backing layer',
          caption: 'HA microneedles with PVP backing cast from PDMS molds',
        },
        {
          src: 'images/microneedle/dissolving-sequence.png',
          alt: 'Three illustrations showing a dissolving microneedle patch being applied and delivering material into skin',
          caption: 'Dissolving-patch sequence: application, insertion, and delivery',
        },
      ],
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
