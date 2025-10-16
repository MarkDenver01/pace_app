import { useEffect, useState } from "react";
import { Download, Clock } from "lucide-react";
import { Card, Button, Spinner } from "flowbite-react";

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: { browser_download_url: string; name: string }[];
}

export default function ReleaseApk() {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/MarkDenver01/pace_app_mobile>/releases")
      .then((res) => res.json())
      .then((data) => setReleases(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2 className="text-2xl font-bold">📦 GitHub APK Releases</h2>

      {releases.map((release) => (
        <Card key={release.id} className="shadow-md border rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h3 className="text-xl font-semibold">
                {release.tag_name}{" "}
                {release.tag_name === "5.0.1" && (
                  <span className="text-green-600 text-sm font-medium">Latest</span>
                )}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{release.name}</p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                <Clock size={14} /> {new Date(release.published_at).toLocaleString()}
              </p>
            </div>

            {release.assets.map((asset, i) => (
              <Button
                key={i}
                color="gray"
                onClick={() => window.open(asset.browser_download_url, "_blank")}
              >
                <Download size={16} className="mr-1" /> {asset.name}
              </Button>
            ))}
          </div>

          <div
            className="mt-2 text-sm text-gray-700 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: release.body }}
          />
        </Card>
      ))}
    </div>
  );
}
