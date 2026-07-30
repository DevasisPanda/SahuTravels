import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeClass, setFadeClass] = useState("opacity-100");

  useEffect(() => {
    // Smooth initial mount
    const timer = setTimeout(() => {
      setFadeClass("opacity-100");
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none transition-opacity duration-500 ease-out-expo ${fadeClass}`}>
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center space-y-6">
        {/* Pulsing Logo Container */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-xl animate-pulse"></div>
          <img
            src="/logo.jpg"
            alt="Sahu Travels"
            className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-2xl relative z-10 animate-pulse"
            onError={(e) => {
              // Hide image if it fails to load and fallback gracefully
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-widest text-yellow-400 uppercase">
            SAHU TRAVELS
          </h2>
          <p className="text-gray-400 text-sm font-semibold tracking-wide animate-pulse">
            Your Fantasy - Our Mission
          </p>
        </div>

        {/* Golden loading line */}
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden relative">
          <div className="animate-loading-bar bg-yellow-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
