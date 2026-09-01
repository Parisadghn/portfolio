/**
 * Central source of truth for all personal data — part 1.
 * Update this file to keep the site synchronized with the CV.
 */

export const profile = {
  name: 'Parisa Dehghan',
  roles: 'Research & Development Specialist | IoT | Scientific Computing | Machine Learning',
  tagline:
    'Research-driven engineer working at the intersection of experimental micro/nano fabrication, intelligent sensing, IoT systems, machine learning, and computational physics.',
  email: 'ssparisa@gmail.com',
  location: 'Tehran, Iran',
  github: 'https://github.com/Parisadghn',
  githubUser: 'Parisadghn',
  linkedin: 'https://linkedin.com/in/parisa-dehghan-697895249',
  cvPath: 'cv/Parisa-Dehghan-CV.pdf',
  languages: [
    { name: 'Persian', level: 'Native' },
    { name: 'English', level: 'Fluent · TOEFL iBT 93' },
    { name: 'French', level: 'Intermediate' },
  ],
}

export const heroPanel = [
  {
    title: 'RESEARCH',
    items: ['Particle Physics', 'Scientific Computing', 'Machine Learning', 'Micro/Nano Fabrication'],
  },
  {
    title: 'ENGINEERING',
    items: ['IoT Systems', 'Sensor Systems', 'MEMS / AFM', 'Embedded AI'],
  },
  {
    title: 'PROGRAMMING',
    items: ['Python', 'C / C++', 'SQL', 'JavaScript', 'MATLAB'],
  },
]

export interface ExperienceItem {
  role: string
  org: string
  period: string
  kind: 'engineering' | 'teaching'
  summary: string
  projects: { title: string; points: string[]; flow?: string[] }[]
  tags: string[]
}

export const experience: ExperienceItem[] = [
  {
    role: 'Internet of Things Specialist',
    org: 'Iran IoT Expansion Center',
    period: 'Since May 2025',
    kind: 'engineering',
    summary:
      'End-to-end design of a real-time smart health-monitoring IoT platform — from simulated LoRa wearables to a live web monitoring interface.',
    projects: [
      {
        title: 'Smart Health-Monitoring Web Application',
        points: [
          'End-to-end architecture: real-time IoT monitoring system ingesting telemetry from smart wristbands (GPS, blood pressure, SpO₂, fall detection, water-immersion detection).',
          'Device simulation: emulated LoRa-enabled wearables in Node-RED, publishing realistic high-frequency sensor streams via MQTT.',
          'Data pipeline: Node.js REST/MQTT service that validates, timestamps, and persists telemetry into a local SQL database (SQLite/MySQL).',
          'Alert engine with clinical thresholds: transition-based alerting that never spams, with fall and water-immersion events latched until caregiver acknowledgment.',
          'Live monitoring UI: interactive map with color-coded status markers, searchable person list, and vital-history charts with threshold bands.',
          'Responsive web UI built with HTML/CSS and JavaScript.',
        ],
        flow: ['Smart Wristband', 'LoRa / MQTT', 'Node.js Backend', 'SQL', 'Web Dashboard'],
      },
    ],
    tags: ['MQTT', 'LoRa', 'Node-RED', 'Node.js', 'SQL', 'Real-time telemetry', 'Web UI'],
  },
  {
    role: 'IoT Instructor',
    org: 'Iran IoT Expansion Center',
    period: '2025',
    kind: 'teaching',
    summary:
      'Delivered a 6-week online “Intro to IoT” course for students aged 8–12 — designing accessible, hands-on material for young learners.',
    projects: [],
    tags: ['Teaching', 'Curriculum design', 'STEM outreach'],
  },
]
