import { useEffect } from "react";

export default function Booking() {
  useEffect(() => {
    window.location.replace("https://www.sahubus.in/m/#/tabs/home");
  }, []);

  return (
    <div className="flex-1 bg-black min-h-[60vh] flex items-center justify-center text-white">
      <div className="text-center space-y-4 max-w-md px-4">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-3xl font-bold text-yellow-400">Redirecting...</h1>
        <p className="text-gray-300">
          We are redirecting you to Sahu Travels official booking portal.
        </p>
        <p className="text-sm text-gray-500">
          If you are not redirected automatically,{" "}
          <a
            href="https://www.sahubus.in/m/#/tabs/home"
            className="text-yellow-400 hover:text-yellow-300 underline font-semibold"
          >
            click here to visit the booking portal
          </a>.
        </p>
      </div>
    </div>
  );
}
