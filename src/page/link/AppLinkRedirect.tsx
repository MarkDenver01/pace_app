import { useEffect } from "react";

export default function AppLinkRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const universityId = params.get("universityId");
    const token = params.get("token");

    // Your custom URL scheme or Android intent URI
    const appUrl = `paceapp://university?universityId=${universityId}&token=${token}`;
    // Fallback to Play Store (change to your real Play Store URL)
    const playStoreUrl = "https://pace-app-frontend.onrender.com/apk-uploads";

    // Try to open the app
    window.location.href = appUrl;

    // After 2 seconds, fallback to Play Store
    const fallbackTimer = setTimeout(() => {
      window.location.href = playStoreUrl;
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h2 className="text-xl font-semibold mb-4">Opening the app…</h2>
      <p>If nothing happens, you’ll be redirected to the APK Release page</p>
    </div>
  );
}
