# HR Workflow Designer — WorkflowPro

## [🚀 Live Demo](YOUR_LIVE_LINK_HERE)

A premium, production-quality HR Workflow Designer built with **React**, **TypeScript**, **Vite**, and **React Flow** (`@xyflow/react`). This application allows HR admins to visually create, configure, and simulate internal HR workflows such as onboarding, leave approval, or document verification.

---

## 🚀 How to Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173/`.

---

## 🏗️ Architecture

```
src/
├── api/                    # Mock API layer
│   └── mockApi.ts          # GET /automations + POST /simulate
├── components/
│   ├── Canvas/             # React Flow canvas wrapper
│   │   ├── WorkflowCanvas.tsx
│   │   └── WorkflowCanvas.css
│   ├── Header/             # Top navigation bar
│   │   ├── Header.tsx
│   │   └── Header.css
│   ├── Nodes/              # 5 custom React Flow node components
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedNode.tsx
│   │   ├── EndNode.tsx
│   │   └── nodes.css
│   ├── PropertyPanel/      # Right sidebar with dynamic forms
│   │   ├── PropertyPanel.tsx
│   │   ├── StartForm.tsx
│   │   ├── TaskForm.tsx
│   │   ├── ApprovalForm.tsx
│   │   ├── AutomatedForm.tsx
│   │   ├── EndForm.tsx
│   │   └── PropertyPanel.css
│   └── Sidebar/            # Left node palette
│       ├── NodePalette.tsx
│       └── NodePalette.css
├── context/
│   └── ThemeContext.tsx     # Light/Dark theme provider
├── store/
│   └── workflowStore.ts    # Zustand global state
├── types/
│   └── workflow.ts         # TypeScript interfaces & enums
├── App.tsx                 # Root layout component
├── main.tsx                # React entry point
└── index.css               # Global design system (CSS variables)
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Zustand** over Redux/Context | Minimal boilerplate, great performance with selectors, and no provider nesting required |
| **Vanilla CSS Variables** | Full theme control without TailwindCSS dependency. 100+ custom properties for dark/light mode |
| **@xyflow/react v12** | Modern React Flow package with first-class TypeScript support and better DX |
| **Component Isolation** | Each node type has its own component + form. Easy to extend with new node types |
| **Mock API as async functions** | Simulates real API behavior (latency, async patterns) without requiring a server |

---

## ✨ Features

### Canvas & Node System
- **5 custom node types**: Start, Task, Approval, Automated Step, End
- **Drag-and-drop** from palette onto canvas
- **Connect nodes** with animated edges by dragging between handles
- **Select, move, delete** nodes and edges
- **Snap-to-grid** alignment (16px grid)
- **MiniMap** for large workflow navigation
- **Zoom/Pan controls** with built-in React Flow controls
- Delete key support for removing selected elements

### Node Configuration Forms
Each node type has a dedicated, fully functional property panel:

| Node Type | Form Fields |
|---|---|
| **Start** | Title, Key-Value metadata editor |
| **Task** | Title (required), Description, Assignee, Due Date, Custom fields (K-V) |
| **Approval** | Title, Approver Role (dropdown), Auto-approve threshold |
| **Automated** | Title, Action selector (fetched from mock API), Dynamic parameters |
| **End** | End message, Summary flag toggle |

All form changes **instantly reflect** on the canvas node's visual display.

### Mock API Layer
- `GET /automations` — Returns 6 automated actions (Send Email, Generate Document, Send Slack, Update HRIS, Generate PDF, Schedule Meeting)
- `POST /simulate` — Validates workflow structure and returns step-by-step execution results

### Workflow Sandbox / Simulation
- **Structural validation**: Checks for Start/End nodes, missing connections, orphan nodes, and cycles (DFS-based)
- **Step-by-step visual execution**: Nodes glow sequentially during simulation
- **Execution timeline**: Shows each step with status indicators in the Sandbox tab
- **Error reporting**: Displays validation errors with clear descriptions

### Theme System
- **Dark mode** (default): Deep navy/indigo palette with purple accents and glowing effects
- **Light mode**: Clean white/lavender palette with indigo accents
- **100+ CSS custom properties** covering backgrounds, text, borders, shadows, node colors, and status indicators
- **Smooth transitions** between themes (0.4s ease)
- **Persisted** via localStorage

### Import/Export
- **Export** workflow as JSON file (nodes + edges)
- **Import** workflow from JSON file to restore state

---

## 🎨 Design Philosophy

The UI prioritizes a **premium, SaaS-grade aesthetic**:
- Inter font family for clean typography
- Glass-morphism effects on surfaces
- Color-coded nodes with unique accent palettes (green/blue/amber/purple/red)
- Micro-animations on hover, selection, and simulation
- Carefully crafted shadows, borders, and spacing
- Responsive empty states with instructional copy

---

## 📦 Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| TypeScript | 6.x | Type safety |
| Vite | 8.x | Build tool & dev server |
| @xyflow/react | 12.x | Workflow canvas with React Flow |
| Zustand | 5.x | Global state management |
| Lucide React | 1.x | SVG icon library |

---

## 🔮 What I'd add with more time

- **Undo/Redo** via Zustand middleware or custom history stack
- **Auto-layout** using dagre/elkjs for automatic node positioning
- **Node templates** — pre-built workflow templates (Onboarding, Leave Request, etc.)
- **Workflow validation errors shown on nodes** — red borders/badges on invalid nodes
- **Node version history** — track changes to individual node configurations
- **Keyboard shortcuts** — Ctrl+Z, Ctrl+S, Ctrl+Shift+S
- **Collaborative editing** — real-time multi-user support via WebSocket
- **Backend persistence** — Save/load workflows from a database
