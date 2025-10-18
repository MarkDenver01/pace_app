import { useEffect, useState } from "react";

export default function AppLinkRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const universityId = params.get("universityId");
    const token = params.get("token");

    const appUrl = `paceapp://university?universityId=${universityId}&token=${token}`;
    const fallbackUrl = "https://pace-app-frontend.onrender.com/apk-uploads";

    const ua = navigator.userAgent || "";
    const isFacebook = ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Messenger");

    if (isFacebook) {
      window.location.href = fallbackUrl;
      return;
    }

    const now = Date.now();

    // Attempt to open the app
    window.location.href = appUrl;

    // Show spinner state
    setIsRedirecting(true);

    // Check if app was opened (fallback if not)
    const timer = setTimeout(() => {
      if (Date.now() - now < 1800) {
        window.location.href = fallbackUrl;
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-semibold mb-2">
        {isRedirecting ? "Opening the app…" : "Preparing to open app…"}
      </h2>
      <p className="text-gray-600">
        If nothing happens, you’ll be redirected to the APK Release page shortly.
      </p>
    </div>
  );
}
