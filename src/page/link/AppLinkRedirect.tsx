import { useEffect, useState } from "react";

export default function AppLinkRedirect() {
  const [isFacebookBrowser, setIsFacebookBrowser] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const universityId = params.get("universityId");
    const token = params.get("token");

    const fallbackUrl = "https://pace-app-frontend.onrender.com/apk-uploads";
    const appScheme = `paceapp://university?universityId=${universityId}&token=${token}`;
    const intentUrl = `intent://university?universityId=${universityId}&token=${token}#Intent;scheme=paceapp;package=io.dev.pace_app_mobile;end;`;

    const ua = navigator.userAgent || "";
    const isFacebook = ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Messenger");
    const isInstagram = ua.includes("Instagram");
    const isInAppBrowser = isFacebook || isInstagram;

    setIsFacebookBrowser(isInAppBrowser);

    if (isInAppBrowser) {
      // Show an instruction UI instead of hard redirect
      return;
    }

    setIsRedirecting(true);

    // Try opening via custom scheme first
    window.location.href = appScheme;

    // Fallback to intent:// if custom scheme fails
    const timer = setTimeout(() => {
      window.location.href = intentUrl;
    }, 800);

    // Final fallback to web
    const finalTimer = setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(finalTimer);
    };
  }, []);

  const handleOpenInBrowser = () => {
    const current = window.location.href;
    window.open(current, "_blank");
  };

  const handleTryApp = () => {
    const params = new URLSearchParams(window.location.search);
    const universityId = params.get("universityId");
    const token = params.get("token");
    window.location.href = `paceapp://university?universityId=${universityId}&token=${token}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
      {isFacebookBrowser ? (
        <div className="max-w-md bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Open in Chrome
          </h2>
          <p className="text-gray-600 mb-4">
            It looks like you opened this link from <strong>Facebook</strong> or{" "}
            <strong>Instagram</strong>, which prevents automatic app opening.
            Please tap the <strong>three dots ⋯</strong> in the top right and
            choose <strong>“Open in Chrome”</strong> to continue.
          </p>
          <button
            onClick={handleOpenInBrowser}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Open in Chrome
          </button>
        </div>
      ) : isRedirecting ? (
        <div>
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-6" />
          <h2 className="text-xl font-semibold mb-2">Opening the app…</h2>
          <p className="text-gray-600">
            If nothing happens, please try again below.
          </p>
          <button
            onClick={handleTryApp}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : (
        <p>Preparing to open the app…</p>
      )}
    </div>
  );
}
