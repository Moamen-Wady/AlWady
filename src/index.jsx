import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
const root = createRoot(document.getElementById("root"));
export const ipcRenderer = window.ipcRenderer;

export function ReadContent() {
  root.render(<App />);
}
