import { useEffect, useState } from "react";
import { Download, Package, Clock, Tag } from "lucide-react";
import { Spinner, Badge, Card } from "flowbite-react";

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
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
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color="info" />
      </div>
    );

  if (releases.length === 0)
    return (
      <div className="text-center text-gray-500 py-20">
        <Package size={40} className="mx-auto mb-2 opacity-60" />
        <p>No releases found.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Pace Mobile Releases
      </h1>

      <div className="space-y-8">
        {releases.map((release, index) => (
          <Card
            key={release.id}
            className="shadow-sm border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300"
          >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {release.tag_name}
                  </h2>
                </div>

                {release.prerelease && (
                  <Badge color="warning" className="w-fit">
                    Pre-release
                  </Badge>
                )}
                {index === 0 && (
                  <Badge color="success" className="w-fit">
                    Latest
                  </Badge>
                )}
              </div>

              <div className="flex items-center text-gray-500 text-xs">
                <Clock size={14} className="mr-1" />
                {new Date(release.published_at).toLocaleString()}
              </div>
            </div>

            {/* BODY */}
            {release.body && (
              <p className="mt-3 text-gray-700 text-sm whitespace-pre-wrap">
                {release.body}
              </p>
            )}

            {/* ASSETS */}
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-gray-700 font-semibold mb-2">Assets</p>
              {release.assets.length > 0 ? (
                <ul className="space-y-2">
                  {release.assets.map((asset, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <span className="text-gray-800 text-sm">{asset.name}</span>
                      <button
                        onClick={() =>
                          window.open(asset.browser_download_url, "_blank")
                        }
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
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
  );
}
