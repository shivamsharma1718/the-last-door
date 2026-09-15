# The Last Door

A browser-based first-person psychological horror game built with **React**, **TypeScript**, **Three.js**, and **React Three Fiber**.

---

## Current Implemented Features

* **3D Horror Environment**: Enclosed atmospheric corridor featuring textured dark floors, four walls, ceiling, baseboards, and subtle fog fading into darkness.
* **The Last Door**: Detailed far-end doorway with timber frame, recessed door panels, and a vintage tarnished brass lever handle.
* **Atmospheric Lighting**: Suspended ceiling light fixture (mounting plate, electrical cable, metal shade, emissive bulb) with soft point-light shadow casting and cold door rim lighting.
* **First-Person Camera**: Eye-level perspective (`1.65m`) facing directly towards the door.
* **Pointer-Lock Mouse Controls**: Click-to-lock mouse look controls providing 360° first-person inspection.
* **First-Person Movement**:
  * `W` / `Arrow Up`: Move forward
  * `S` / `Arrow Down`: Move backward
  * `A` / `Arrow Left`: Strafe left
  * `D` / `Arrow Right`: Strafe right
  * `Shift`: Sprint (increases movement speed from 2.6 m/s to 4.8 m/s)
  * Normalized diagonal movement preventing diagonal speed boosts
  * Frame-rate independent delta calculations
* **Collision Boundaries**: Zero-overhead room boundary clamping with player collision radius (`0.35m`) preventing the player from passing through walls or the far door.
* **Minimal Atmospheric HUD**: Non-intrusive center crosshair and control prompt overlay.

---

## Development Instructions

### 1. Project Setup
Open Windows Command Prompt (`cmd.exe`), navigate to the project directory, and install dependencies:
```cmd
cd d:\the-last-door\the-last-door
npm install
```

### 2. Start Development Server
Run the local Vite dev server with Hot Module Replacement (HMR):
```cmd
npm run dev
```
Open your browser and navigate to the displayed local address (typically `http://localhost:5173`).

### 3. Build the Project
Compile TypeScript and generate the production bundle:
```cmd
npm run build
```

To preview the production build locally:
```cmd
npm run preview
```

---

## Git Workflow (Windows Command Prompt)

### 4. Check Git Status
Check the status of modified and untracked files:
```cmd
git status
```

### 5. Create and Switch to a Feature Branch
Create and switch to a new branch for your feature:
```cmd
git checkout -b feature/your-feature-name
```

### 6. Commit Changes
Stage files and commit them with a descriptive message:
```cmd
git add .
git commit -m "feat: implement first-person player movement and collision boundaries"
```

### 7. Push Branch to GitHub
Push your feature branch to the remote repository:
```cmd
git push -u origin feature/your-feature-name
```

---

## Future Roadmap

- [x] First-person camera look (PointerLock)
- [x] First-person WASD & Sprint movement with collision bounds
- [ ] Door interaction
- [ ] Interaction prompts & reticle state transitions
- [ ] Sound effects & psychological ambient audio
- [ ] Flashlight / light switch mechanics
- [ ] Inventory system & key collection
- [ ] Puzzle mechanics
- [ ] Save and load system
- [ ] Enemy or threat system
- [ ] Chapter progression & scene transitions
- [ ] Production deployment & web optimization
