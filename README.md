# 🐒 Monkeys on Keyboards

**Monkeys on Keyboards** is a collaborative 3D interactive canvas with AI-powered image generation, designed for *vibe coders* who want to co-create applications — especially for teams in **AEC (Architecture, Engineering, Construction)** working together to design buildings in a more open, playful, and iterative way.

Built with React Three Fiber and FAL AI, it's not just a dev tool — it's a **creative playground** for coders, designers, and engineers to build AEC-focused apps *together*, live. Think of it like a jam session, but instead of music, you're building tools for buildings.

## 🚀 Key Features

### 3D Interactive Canvas
- **Interactive 3D scene** with various geometric objects and controls
- **Multiple 3D objects**: Box, Cone, Sphere, Cylinder, Torus
- **Transform controls** with move, rotate, and scale modes (keyboard shortcuts: G, R, S)
- **Real-time object manipulation** with visual transform gizmos
- **Clickable objects** with selection and interaction system

### Advanced Scene Elements
- **Fibonacci Scene**: Mathematical art with golden spiral visualization and koala-shaped objects
- **Art Piece Generator**: Click-to-create random shapes (cubes, cylinders, spheres) with random colors and rotations
- **Blue Koala Structure**: Guggenheim-inspired architectural visualization
- **Matrix Cube Instances**: Grid-based cube arrangements with customizable patterns
- **Snake Game**: Interactive 3D snake game within the canvas
- **Terrain System**: Satellite-textured terrain with procedural 3D trees
- **Preset Scenes**: Load predefined scenes (Tall Tower, Castle, Circular Castle)

### Viewport & Camera Controls
- **Multiple viewport presets**: Top, Bottom, Front, Back, Left, Right views
- **Smooth camera animations** between view presets with easing
- **Orbit controls** with customizable targets and positions
- **Perspective and orthographic** camera switching
- **Arctic, Transparent, and Lineweight** rendering modes

### AI-Powered Image Generation
- **FAL AI Integration** for transforming 3D scenes into AI-generated images
- **Real-time canvas capture** functionality with `preserveDrawingBuffer: true`
- **Multiple FLUX model options**:
  - **FLUX Pro Kontext** (`fal-ai/flux-pro/kontext`) - Best for image editing and transformations
  - **FLUX Dev Image-to-Image** (`fal-ai/flux/dev/image-to-image`) - Good balance with strength control
  - **FLUX Dev** (`fal-ai/flux/dev`) - Basic text-to-image with image reference
- **Custom prompt system** for AI generation
- **Image overlay system** for comparing original and AI-generated results

### UI & Controls
- **Comprehensive control panels** for scene manipulation
- **Color picker** with material property controls
- **Effect selector** (matte, metallic, glass, etc.)
- **Object selection panel** with search functionality
- **Geolocation panel** for positioning objects with real-world coordinates
- **Theme switching** (light/dark mode support)
- **Collapsible sidebar panels** for organized workspace

### Collaborative Features
- 🛠️ **Real-time collaborative coding** capabilities
- 🎨 **Built-in UI components** for AEC workflows
- 🔄 **Live preview** of your app as you build
- 🐵 **Chaos-friendly, creativity-first** interface
- 🤝 **Open source & community-driven**

## 🎯 Who It's For

- **Architects who code**
- **Engineers who prototype**
- **Designers who think in systems**
- **AEC professionals** building tools for the built environment
- **Creative developers** with *vibes first, structure later* philosophy

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 15.5.3** - React framework
- **React Three Fiber** - 3D rendering with Three.js
- **React Three Drei** - Useful helpers for R3F
- **Three.js** - 3D graphics library
- **Jotai** - State management
- **Next Themes** - Theme switching

### AI & Enhancement
- **FAL AI Client** - AI image generation
- **React Colorful** - Color picker component

### UI Components
- **Radix UI** - Comprehensive UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## 📦 Getting Started

### Installation

```bash
git clone https://github.com/your-org/monkeys-on-keyboards.git
cd monkeys-on-keyboards
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### FAL AI Setup

1. Get your API key from [fal.ai](https://fal.ai/dashboard)
2. (Optional) Create a `.env.local` file and add:
   ```
   NEXT_PUBLIC_FAL_API_KEY=your_api_key_here
   ```
3. Open the FAL AI Generation panel in the left sidebar
4. Enter your API key (if not set via environment variable)
5. Customize your prompt
6. Click "Capture Scene" to take a snapshot
7. Click "Generate Image" to create an AI-enhanced version

## 🎮 Usage Guide

### Basic Controls
- **Mouse**: Orbit around the scene
- **G**: Switch to translate mode
- **R**: Switch to rotate mode  
- **S**: Switch to scale mode
- **ESC**: Deselect all objects
- **Click objects**: Select and manipulate with transform controls

### Scene Elements
- Toggle various scene elements using the control panels:
  - Fibonacci mathematical art
  - Art piece generator
  - Guggenheim structure
  - Matrix cube instances
  - Snake game
  - Terrain with trees

### Viewport Navigation
- Use viewport controls to switch between different camera angles
- Smooth animations transition between views
- Support for both perspective and orthographic projections

### AI Generation Workflow
1. Arrange your 3D scene
2. Open FAL AI panel
3. Capture the current scene
4. Enter a descriptive prompt
5. Select your preferred FLUX model
6. Generate AI-enhanced version
7. Download or overlay the result

## 🎨 Scene Presets

Load predefined scenes to get started quickly:
- **🏗️ Tall Tower**: Architectural tower structure
- **🏰 Castle**: Medieval castle layout
- **🐨 Circular Castle**: Koala-themed circular architecture

## 🌟 Advanced Features

### Material System
- Multiple material effects (matte, metallic, glass)
- Real-time material property adjustment
- Transparency and lineweight rendering modes
- Arctic lighting mode for enhanced visualization

### Geolocation Integration
- Position objects using real-world coordinates
- Latitude, longitude, and altitude support
- Useful for AEC applications requiring geographic accuracy

### State Management
- Persistent scene state with Jotai atoms
- Toggle visibility of scene elements
- Customizable UI panel arrangements

## 🤝 Contributing

This is an open-source, community-driven project. Contributions are welcome!

## 📄 License

MIT

---

*Built with ❤️ for the AEC community and creative developers everywhere.*