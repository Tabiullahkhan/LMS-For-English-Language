import { useInstall } from "../context/InstallContext";

const InstallBanner = () => {
  const { showBanner, triggerInstall, setShowBanner } = useInstall();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white shadow-lg rounded-xl p-4 flex items-center justify-between border z-50">
      <div>
        <p className="font-semibold text-sm">Install this app</p>
        <p className="text-xs text-gray-500">Get quick access from your home screen</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setShowBanner(false)} className="text-xs text-gray-400">
          Later
        </button>
        <button
          onClick={triggerInstall}
          className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
