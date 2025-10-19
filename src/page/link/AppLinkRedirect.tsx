import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";

export default function AppLinkRedirect() {
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

    // Detect if opened from Facebook or Instagram
    if (isInAppBrowser) {
      Swal.fire({
        icon: "info",
        title: "Open in Chrome",
        html: `
          <p>You’re viewing this link from <b>${isFacebook ? "Facebook" : "Instagram"}</b>.</p>
          <p>These apps prevent automatic app launching.</p>
          <p>Please tap the <b>⋯ (three dots)</b> in the top-right corner and select <b>“Open in Chrome”</b> or <b>“Open in Browser”</b>.</p>
        `,
        confirmButtonText: "CLOSE",
        allowOutsideClick: false,
        allowEscapeKey: false,
        ...getSwalTheme(),
      });
      return;
    }

    // Continue normal redirect flow
    setIsRedirecting(true);

    // Try to open via custom URI scheme
    window.location.href = appScheme;

    // Fallback to intent://
    const timer = setTimeout(() => {
      window.location.href = intentUrl;
    }, 800);

    // Final fallback (if not installed)
    const finalTimer = setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(finalTimer);
    };
  }, []);

  const handleTryAgain = () => {
    const params = new URLSearchParams(window.location.search);
    const universityId = params.get("universityId");
    const token = params.get("token");
    window.location.href = `paceapp://university?universityId=${universityId}&token=${token}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
      {isRedirecting ? (
        <div>
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-6" />
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Opening the app…</h2>
          <p className="text-gray-600 mb-4">
            If nothing happens, please try again manually.
          </p>
          <button
            onClick={handleTryAgain}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
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
