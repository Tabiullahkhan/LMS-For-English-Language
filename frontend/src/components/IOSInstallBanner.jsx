import { useState, useEffect } from "react";
import { isIOS, isInStandaloneMode } from "../utils/deviceDetect";

const IOSInstallBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // iOS Safari never fires beforeinstallprompt, so it needs its own manual-instructions banner
    if (isIOS() && !isInStandaloneMode()) {
      const dismissed = localStorage.getItem("iosInstallDismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setShow(true), 4000); // delay so it doesn't feel like an ad on load
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("iosInstallDismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white shadow-lg rounded-xl p-4 border z-50 flex items-start gap-3">
      <div className="flex-1">
        <p className="font-semibold text-sm">Install this app on your iPhone</p>
        <p className="text-xs text-gray-500 mt-1">
          Tap the Share icon below, then select <span className="font-semibold">"Add to Home Screen"</span>.
        </p>
      </div>
      <button onClick={dismiss} className="text-xs text-gray-400">
        Close
      </button>
    </div>
  );
};

export default IOSInstallBanner;
