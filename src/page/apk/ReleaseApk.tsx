import { useEffect, useState } from "react";
import { Download, Clock, Smartphone, Package, Tag } from "lucide-react";
import { Card, Button, Spinner, Badge } from "flowbite-react";

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
    fetch("https://api.github.com/repos/MarkDenver01/pace_app_mobile/releases")
      .then((res) => res.json())
      .then((data) => setReleases(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color="info" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center mb-8 text-center">
        <Smartphone className="text-blue-600 mb-3" size={40} />
        <h1 className="text-3xl font-bold text-gray-800">
          Pace Mobile APK Releases
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Download the latest versions of the Pace Android app below.
        </p>
      </div>

      <div className="space-y-6">
        {releases.map((release, index) => (
          <Card
            key={release.id}
            className="rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
              {/* LEFT SIDE */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag size={18} className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {release.tag_name}
                  </h2>
                  {index === 0 && (
                    <Badge color="success" className="ml-1">
                      Latest
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 text-sm">{release.name}</p>
                <div className="flex items-center text-gray-500 text-xs mt-1">
                  <Clock size={14} className="mr-1" />
                  {new Date(release.published_at).toLocaleString()}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-wrap gap-2">
                {release.assets.map((asset, i) => (
                  <Button
                    key={i}
                    color="blue"
                    size="sm"
                    onClick={() =>
                      window.open(asset.browser_download_url, "_blank")
                    }
                    className="flex items-center gap-1"
                  >
                    <Download size={16} /> Download
                  </Button>
                ))}
              </div>
            </div>

            {release.body && (
              <div className="mt-3 border-t border-gray-100 pt-3 text-gray-700 text-sm whitespace-pre-wrap">
                {release.body}
              </div>
            )}
          </Card>
        ))}
      </div>

      {releases.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <Package size={40} className="mx-auto mb-2 opacity-60" />
          <p>No releases found yet.</p>
        </div>
      )}
    </div>
  );
}
