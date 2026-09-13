import { createContext, useContext, useEffect, useState } from "react";

const InstallContext = createContext();

export const InstallProvider = ({ children }) => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // stop Chrome's default mini-infobar so we control when/how it's shown
      setInstallPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setInstallPrompt(null);
  };

  return (
    <InstallContext.Provider value={{ showBanner, triggerInstall, setShowBanner }}>
      {children}
    </InstallContext.Provider>
  );
};

export const useInstall = () => useContext(InstallContext);
