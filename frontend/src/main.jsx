import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { InstallProvider } from "./context/InstallContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <InstallProvider>
            <App />
          </InstallProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// Register the service worker so the site becomes installable and caches its shell.
// Only registered in production builds - during development (npm run dev), the service
// worker can conflict with Vite's dev server and cause confusing fetch errors like the
// ones you might see in the console. Test PWA install behavior with `npm run build`
// followed by `npm run preview` instead.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((err) => {
      console.log("Service worker registration failed:", err);
    });
  });
}
