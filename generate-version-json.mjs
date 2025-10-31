import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "public");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "version.json");

async function generateVersionFile() {
  try {
    console.log("Fetching latest release from GitHub...");
    const res = await fetch("https://api.github.com/repos/MarkDenver01/pace_app_mobile/releases");
    const releases = await res.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      console.warn("⚠️ No releases found. Skipping version.json generation.");
      return; // Skip without failing
    }

    // Use the first non-prerelease release, fallback to the latest if none
    const data = releases.find(r => !r.prerelease) || releases[0];

    const latestAsset = data.assets?.find(a => a.browser_download_url?.endsWith(".apk")) || data.assets?.[0];
    const versionCode = parseInt(data.tag_name?.replace(/[^\d]/g, "") || "1", 10);

    const jsonData = {
      latestVersionName: data.tag_name || "unknown",
      latestVersionCode: versionCode,
      apkUrl: latestAsset?.browser_download_url || "",
      releaseNotes: data.body?.trim() || "No release notes available."
    };

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonData, null, 2));
    console.log(`✅ version.json created at: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("❌ Failed to generate version.json:", error);
    // Do NOT exit the process, just skip
  }
}

await generateVersionFile();
