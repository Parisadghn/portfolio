# Making `centrifuge.CATProduct` dynamic

The rotor is a 4-place swinging-bucket assembly: a **"+"-shaped header** that spins
about the rotor axis, with a **bucket ("Bugget") hanging at each arm end** that swings
from 0° (hanging, loading position) out to 90° (horizontal, running position).

What the `.CATProduct` already contains (read from the file):

| Node | Role |
|---|---|
| `Product2` | root assembly |
| `Part5.1` | header / hub body — held by `Fix.1` |
| `Part1` | reference geometry — used by `Assy_Symmetry_Plane` |
| `Bugget.1` → `Bugget.1.1` | bucket sub-assembly + bucket part |
| `Bugget.2` → `Bugget.2.1` | bucket sub-assembly + bucket part |
| `Assembly Symmetry.1` | produces the mirrored instance **`Symmetry of Bugget.2.1`** |
| `Assembly Symmetry.2` | produces the mirrored instance **`Symmetry of Bugget.1.1`** |
| Constraints | `Fix.1` · `Coincidence.2` · `Offset.3` · `Offset.4` · **`Angle.5`** (the bucket hinge angle) |

So: **2 bucket sub-assemblies + 2 assembly-symmetry instances = the 4 arms of the "+"**,
and `Angle.5` is the angular (hinge) constraint you want to drive from **0° to 90°**.

---

## Route A — DMU Kinematics (native, recommended)

This is the "proper" CATIA mechanism: it makes the assembly genuinely dynamic
(you get a `Mechanism` object you can animate, record and replay).

1. Open `centrifuge.CATProduct` and switch the assembly to **Design Mode**
   (right-click the root in the tree → *Representations* → *Design Mode*).
2. Check that the parts are correctly positioned: **Update All** first.
3. Switch to **Digital Mockup → DMU Kinematics** (start → Digital Mockup → DMU Kinematics).
4. **Insert → Simulation → Mechanism** (create `Mechanism.1`).
5. Add the joints (*Mechanism* toolbar → **Joint**):
   * **Revolute** on the rotor: pick the axis of `Part5.1` (the header) and the axis of
     the fixed housing/reference → this is the spin DOF.
   * **Revolute** on each bucket: pick the arm's hinge axis (the trunnion pin axis) and
     the corresponding axis on the bucket → this is the 0°–90° swing DOF.
   * If CATIA reports that the assembly is already fully constrained, tick
     **"Do not use assembly constraints"** when creating the mechanism and add the
     joints manually (4 bucket revolute joints + 1 rotor revolute joint = 5 DOF).
6. **Fix** the housing if the mechanism reports 6 free DOF instead of 5.
7. Animate: **Simulation with commands** (mechanism toolbar) — drag the rotor command and
   the buckets follow if you added a **law**; or use **Simulation with laws**:
   * command on the rotor angle → *Add* a law: `Angle = time * 360` (1 turn/s)
   * command on each bucket angle → *Add* a law that ramps to 90°, e.g.
     `Angle = 90 * min(1; time)` (swing out over the first second, then stay at the stop).
8. **Play** — the header spins and the four buckets swing to 90° and stay there.

Save the mechanism inside the product (**File → Save**) so the file itself carries the
kinematics from now on.

---

## Route B — drive the existing constraint with the included macro

`centrifuge_animate.CATScript` does the same thing using automation, without building a
mechanism:

* **Swing:** every instance whose name contains `Bugget`/`Bucket` gets its angular
  constraint (`…Angle…`) set to 90°, so the real hinge is used and the mirrored
  instances follow through the assembly symmetry.
* **Spin:** the children of the root product are rotated about the rotor axis with
  `Position.GetComponents` / `Position.SetComponents` (12-element axis-system array,
  millimetres) — no geometry is modified.

Run it from **Tools → Macro → Macros…** (Type = *CATScript*). Settings are the constants at
the top of the file: `SWING_TO_DEG`, `SPIN_STEP_DEG`, `SPIN_FRAME_MS`, `TURNS`, `AUTO_AXIS`.

> If the macro cannot find an angular constraint it falls back to rotating each bucket
> about the tangential hinge axis through its own origin — a geometric approximation of
> the swing, useful for a quick visual check.

---

## Route C — smooth VBA animation (smooth, interruptible)

CATScript is VBScript and has no `DoEvents`/`Sleep`, so the repaint between frames is
best-effort. For a continuous animation open **Tools → Macro → Visual Basic Editor**, add a
module and paste this (it is the same geometry work, with a real timing loop):

```vb
Option Explicit
Private Declare Sub Sleep Lib "kernel32" (ByVal ms As Long)

Private Const SWING_TO_DEG As Double = 90
Private Const STEP_DEG As Double = 3
Private Const FRAME_MS As Long = 33

Sub CentrifugeRun()
    Dim oRoot As Product, oP As Product, pos(11) As Double
    Dim cx As Double, cy As Double, n As Long, done As Double

    Set oRoot = CATIA.ActiveDocument.Product

    ' 1 — swing every bucket to 90° (drive the assembly's Angle constraint)
    Dim col As New Collection
    Collect oRoot, col
    Dim i As Long, j As Long
    For Each oP In col
        For j = 1 To oP.Connections("CATIAConstraints").Count
            If InStr(1, oP.Connections("CATIAConstraints").Item(j).Name, "Angle") > 0 Then
                oP.Connections("CATIAConstraints").Item(j).Value = SWING_TO_DEG
            End If
        Next j
    Next oP

    ' 2 — rotor axis = mean xy of the buckets
    For Each oP In col
        oP.Position.GetComponents pos
        cx = cx + pos(9): cy = cy + pos(10): n = n + 1
    Next oP
    If n > 0 Then cx = cx / n: cy = cy / n

    ' 3 — spin; interrupt with Esc / Ctrl-Break
    Do While True
        For Each oP In oRoot.Products
            RotateAx oP, cx, cy, 0, 0, 0, 1, STEP_DEG
        Next oP
        DoEvents
        Sleep FRAME_MS
    Loop
End Sub

Sub Collect(oP As Product, col As Collection)
    Dim c As Product
    For Each c In oP.Products
        If InStr(1, c.Name, "Bugget", vbTextCompare) > 0 Then
            col.Add c
        Else
            Collect c, col
        End If
    Next c
End Sub

' Rodrigues rotation of one instance about the axis (P, K), in degrees
Sub RotateAx(oP As Product, px#, py#, pz#, kx#, ky#, kz#, deg#)
    Dim pos(11) As Double, a#, c#, s#, vx#, vy#, vz#
    oP.Position.GetComponents pos
    a = deg * 4 * Atn(1) / 180: c = Cos(a): s = Sin(a)
    Dim i As Long
    For i = 0 To 8 Step 3                       ' x-axis, y-axis, z-axis
        vx = pos(i): vy = pos(i + 1): vz = pos(i + 2)
        pos(i)     = vx * c + (ky * vz - kz * vy) * s + kx * (kx * vx + ky * vy + kz * vz) * (1 - c)
        pos(i + 1) = vy * c + (kz * vx - kx * vz) * s + ky * (kx * vx + ky * vy + kz * vz) * (1 - c)
        pos(i + 2) = vz * c + (kx * vy - ky * vx) * s + kz * (kx * vx + ky * vy + kz * vz) * (1 - c)
    Next i
    vx = pos(9) - px: vy = pos(10) - py: vz = pos(11) - pz
    pos(9)  = vx * c + (ky * vz - kz * vy) * s + kx * (kx * vx + ky * vy + kz * vz) * (1 - c) + px
    pos(10) = vy * c + (kz * vx - kx * vz) * s + ky * (kx * vx + ky * vy + kz * vz) * (1 - c) + py
    pos(11) = vz * c + (kx * vy - ky * vx) * s + kz * (kx * vx + ky * vy + kz * vz) * (1 - c) + pz
    oP.Position.SetComponents pos
End Sub
```

`DoEvents` keeps CATIA responsive and `Sleep` sets the frame rate; the loop runs until you
interrupt it. Remove `Do While True … Loop` and use `For frame = 1 To 120` for a fixed
4-second clip.

---

## Route D — watch it in the browser (no CATIA required)

The portfolio ships an interactive schematic of this mechanism: the "+"-header spins, the
four buckets swing 0° → 90° from the real centripetal equilibrium (`tan θ = ω²r / g`), and
the panel shows the swing transient, RCF and the position of the `Angle.5` hinge.

> The browser animation is a **schematic of the assembly structure** (instance names,
> constraints and symmetry features read from the `.CATProduct`) — it is not a dimensional
> replica of the `.CATPart` solids, which are not stored in a product file.

