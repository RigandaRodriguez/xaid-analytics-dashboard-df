import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Render app with QueryClient provider
createRoot(document.getElementById("root")!).render(<App />);