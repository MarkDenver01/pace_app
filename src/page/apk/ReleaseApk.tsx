import { useEffect, useState } from "react";
import { Download, Clock, Tag, Package } from "lucide-react";
import { Spinner, Badge, Card } from "flowbite-react";

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  prerelease: boolean;
  published_at: string;
  assets: { browser_download_url: string; name: string }[];
}

export default function ReleaseApk() {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/MarkDenver01/pace_app_mobile/releases")
      .then((res) => res.json())
      .then((data) => setReleases(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching releases:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-80">
        <Spinner size="xl" color="info" />
      </div>
    );

  if (releases.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-500">
        <Package size={42} className="mb-2 opacity-60" />
        <p>No releases found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-8">
          Pace Mobile APK Releases
        </h1>

        <div className="space-y-8">
          {releases.map((release, index) => (
            <Card
              key={release.id}
              className="shadow-md border border-blue-100 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white"
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Tag size={18} className="text-blue-700" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {release.tag_name}
                    </h2>
                  </div>

                  {release.prerelease && (
                    <Badge
                      color="warning"
                      className="w-fit text-yellow-800 bg-yellow-100 border border-yellow-300"
                    >
                      Pre-release
                    </Badge>
                  )}
                  {index === 0 && (
                    <Badge
                      color="success"
                      className="w-fit text-green-800 bg-green-100 border border-green-300"
                    >
                      Latest
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                  <Clock size={14} className="mr-1" />
                  {new Date(release.published_at).toLocaleString()}
                </div>
              </div>

              {/* BODY */}
              {release.body && (
                <p className="mt-3 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {release.body}
                </p>
              )}

              {/* ASSETS */}
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-blue-900 font-semibold mb-2">Assets</p>
                {release.assets.length > 0 ? (
                  <ul className="space-y-2">
                    {release.assets.map((asset, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-gray-800 text-sm">{asset.name}</span>
                        <button
                          onClick={() =>
                            window.open(asset.browser_download_url, "_blank")
                          }
                          className="flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No downloadable files found.
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
