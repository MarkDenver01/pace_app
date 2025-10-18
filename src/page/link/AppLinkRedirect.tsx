import { useEffect, useState } from "react";

export default function AppLinkRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const universityId = params.get("universityId");
    const token = params.get("token");

    const appUrl = `https://pace-app-frontend.onrender.com/university?universityId=${universityId}&token=${token}`;
    const intentUrl = `intent://university?universityId=${universityId}&token=${token}#Intent;scheme=https;package=io.dev.pace_app_mobile;end;`;
    const fallbackUrl = "https://pace-app-frontend.onrender.com/apk-uploads";

    // Inject Android App Link meta tags (like your working version)
    const metaTags = [
      { property: "al:android:url", content: appUrl },
      { property: "al:android:package", content: "io.dev.pace_app_mobile" },
      { property: "al:android:app_name", content: "Pace App Mobile" }
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });

    // Detect Facebook in-app browser
    const ua = navigator.userAgent || "";
    const isFacebook = ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Messenger");

    if (isFacebook) {
      // Facebook blocks intent links, fallback directly
      window.location.href = fallbackUrl;
      return;
    }

    setIsRedirecting(true);

    // Try opening via intent URL (works best for Android browsers)
    window.location.href = intentUrl;

    // Fallback if app not installed (after 1.5s)
    const timer = setTimeout(() => {
      window.location.href = fallbackUrl;
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
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
