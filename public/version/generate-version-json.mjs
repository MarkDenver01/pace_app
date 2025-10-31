import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const OUTPUT_DIR = path.join(process.cwd(), "public", "apk-uploads");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "version.json");

async function generateVersionFile() {
  try {
    console.log("Fetching latest release from GitHub...");
    const res = await fetch("https://api.github.com/repos/MarkDenver01/pace_app_mobile/releases/latest");
    const data = await res.json();

    const latestAsset = data.assets?.[0];
    const versionCode = parseInt(data.tag_name?.replace(/[^\d]/g, "") || "1");

    const jsonData = {
      latestVersionName: data.tag_name || "unknown",
      latestVersionCode: versionCode,
      apkUrl: latestAsset?.browser_download_url || "",
      releaseNotes: data.body || "No release notes available."
    };

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonData, null, 2));
    console.log(`version.json created at: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Failed to generate version.json:", error);
    process.exit(1);
  }
}

await generateVersionFile();
