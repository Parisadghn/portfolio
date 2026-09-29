/**
 * CATIA design showcase data.
 *
 * Every structural fact below was read out of `public/cad/centrifuge.CATProduct`
 * (ASCII feature/instance names inside the binary) and corroborated by the
 * thumbnail CATIA embedded in the file (`CATPreview` → images/centrifuge-catia-preview.jpg).
 * Nothing here is invented: roles marked "(inferred)" follow from the feature
 * names, the constraint list and the 4-fold layout visible in that preview.
 */

export const cadDoc = {
  file: 'centrifuge.CATProduct',
  path: 'cad/centrifuge.CATProduct',
  script: 'cad/centrifuge_animate.CATScript',
  guide: 'cad/CATIA-DYNAMIC-SETUP.md',
  preview: 'images/centrifuge-catia-preview.jpg',
  app: 'CATIA V5 — Dassault Systèmes',
  release: 'V5R32 · SP6 · HF0',
  build: '03-01-2024.22.10',
  format: 'CATProduct · stream V5_CFV2',
  minRead: 'CATIAV5R32',
  size: '51 KB',
}

export interface CadNode {
  name: string
  role: string
  /** marks the node that carries the driven hinge angle */
  driven?: boolean
  children?: CadNode[]
}

export const productTree: CadNode[] = [
  {
    name: 'Product2',
    role: 'root assembly',
    children: [
      { name: 'Part5.1', role: 'header / hub body — the only fixed geometry (Fix.1)' },
      { name: 'Part1', role: 'reference geometry for Assy_Symmetry_Plane' },
      {
        name: 'Bugget.1',
        role: 'bucket sub-assembly',
        children: [{ name: 'Bugget.1.1', role: 'bucket — 3D shape rep "Product2_geom"' }],
      },
      {
        name: 'Bugget.2',
        role: 'bucket sub-assembly',
        children: [{ name: 'Bugget.2.1', role: 'bucket — 3D shape rep "Product2_geom"' }],
      },
      { name: 'Assembly Symmetry.1', role: 'mirror feature → “Symmetry of Bugget.1.1”' },
      { name: 'Assembly Symmetry.2', role: 'mirror feature → “Symmetry of Bugget.2.1”' },
    ],
  },
]

export interface CadConstraint {
  name: string
  type: string
  role: string
  driven?: boolean
}

/** Constraint objects present in the file, in the order they are streamed. */
export const constraintRows: CadConstraint[] = [
  { name: 'Fix.1', type: 'Fix', role: 'anchors Part5.1 — the header is the fixed body the rotor turns in' },
  { name: 'Coincidence.2', type: 'Coincidence', role: 'bucket positioning — axis / plane coincidence' },
  { name: 'Offset.3', type: 'Offset', role: 'bucket positioning — linear offset' },
  { name: 'Offset.4', type: 'Offset', role: 'bucket positioning — linear offset' },
  {
    name: 'Angle.5',
    type: 'Angle (hinge)',
    role: 'bucket pivot angle — 0° hanging → 90° running; this is the DOF the mechanism animates',
    driven: true,
  },
]

/** Bucket instances, in arm order: 0 → 3 counter-clockwise from the +X arm. */
export const bucketNames = [
  'Bugget.1.1',
  'Symmetry of Bugget.1.1',
  'Bugget.2.1',
  'Symmetry of Bugget.2.1',
]

/** Two bucket sub-assemblies + two assembly-symmetry instances = the 4 arms of the “+”. */
export const bucketSource = [
  { name: 'Bugget.1.1', source: 'part in Bugget.1' },
  { name: 'Symmetry of Bugget.1.1', source: 'Assembly Symmetry.1' },
  { name: 'Bugget.2.1', source: 'part in Bugget.2' },
  { name: 'Symmetry of Bugget.2.1', source: 'Assembly Symmetry.2' },
]

export const speedPresets = [
  { label: 'REST', rpm: 0, hint: 'buckets hanging — loading position' },
  { label: 'HALF SWING', rpm: 90, hint: '≈45° — tan θ = ω²r/g with ω²r = g' },
  { label: 'SWING-OUT', rpm: 1000, hint: 'buckets reach the 90° stop' },
  { label: 'OPERATING', rpm: 3000, hint: 'buckets locked on the stop' },
]

export const designNotes = [
  'Two bucket sub-assemblies plus two Assembly Symmetry features produce the four arm positions of the “+”-shaped header.',
  'Angle.5 is the hinge constraint of the bucket — the single angular DOF the animation drives from 0° to 90°.',
  'The mechanism is modelled on the real swing equilibrium: tan θ = ω²r / g, saturating at the 90° mechanical stop.',
]
