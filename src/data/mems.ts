/**
 * MEMS Simulation Application: content for the featured section.
 * For licensing reasons the app itself is not hosted here and its screenshots are not shown (see README → "The MEMS app").
 */
export const memsApp = {
  intro:
    'Simulates micro/nano-fabrication on a silicon wafer step by step: lithography, RIE, BHF, KOH, oxidation and resist strip, on either side of the wafer or both. Every step appears in 3D, in cross-section and as a simulated microscope image, with the thickness of each layer.',
  features: [
    {
      title: 'Process simulation',
      text: 'Orientation-dependent KOH etching: {111} walls, V-groove stops, convex-corner undercut and tips form by themselves.',
    },
    {
      title: 'Mask design',
      text: 'Draw masks with exact dimensions and constraints as in a CAD sketcher, start from a sample, or import GDSII, DXF, JSON or an image.',
    },
    {
      title: 'Three linked views',
      text: 'Move and resize 3D, cross-section and microscope windows. Hover anywhere for the full film stack at that point.',
    },
    {
      title: 'Your own data',
      text: 'Every etch rate is public data by default and can be replaced by your measurements, per table or per step.',
    },
  ],
  steps: [
    { name: 'Lithography', text: 'Applies a mask in photoresist, with alignment offset and rotation.' },
    { name: 'RIE', text: 'Removes Si₃N₄ that resist does not protect, and stops on SiO₂.' },
    { name: 'BHF', text: 'Etches exposed SiO₂ and stops at silicon. Clears or only thins.' },
    { name: 'KOH', text: 'Etches silicon along its crystal planes; computes the maximum time.' },
    { name: 'Oxidation', text: 'Grows SiO₂ on exposed silicon, with the furnace time (Deal–Grove).' },
    { name: 'Acetone', text: 'Strips the resist once the pattern has been transferred.' },
  ],
  results: [
    { label: 'Tip height', standard: '15.8 µm', fine: '17.2 µm', reference: '15–21 µm measured' },
    { label: 'Cantilever thickness', standard: '8.2 µm', fine: '9.9 µm', reference: '10.5 µm etch budget' },
  ],
  model:
    'Every cell of each wafer face keeps its own film stack and etched depth. Each face is a depth map evolved with a Hamilton–Jacobi (Godunov) scheme, with rates interpolated from ten plane families: the fastest planes win at convex corners and the slowest at concave ones. It runs in a Web Worker, so the interface stays responsive.',
  calibration:
    'The {221} and {331} rates that control convex-corner undercut are calibrated on a real etched chip, from two independent observations that give the same value.',
  limits:
    'Limits, stated plainly: single-crystal (100) silicon, no boron etch stop, ideal resist, and tip apex sharpness is below the grid.',
  stack: ['React', 'TypeScript', 'Three.js', 'Web Worker', 'Tailwind CSS', 'Vite'],
}
