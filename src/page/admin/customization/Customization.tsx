import { useEffect, useState } from "react";
import { FileInput, Textarea, Select, Label, Button } from "flowbite-react";
import { Paintbrush } from "lucide-react";
import { useThemeContext, type Theme } from "../../../context/ThemeContext";
import { getTheme, saveOrUpdateTheme } from "../../../libs/ApiResponseService";
import type {
  CustomizationResponse,
  CustomizationRequest,
} from "../../../libs/models/Customization";
import { useAuth } from "../../../context/AuthContext";

// Only these themes can be selected (no super_admin, no custom_admin)
const NORMAL_THEMES: Theme[] = [
  "light",
  "dark",
  "redish",
  "purplelish",
  "brownish",
];

// Full list for validation including super_admin and custom_admin
const ALL_THEMES: Theme[] = [...NORMAL_THEMES, "super_admin", "custom_admin"];

// Type guard to check if string is a valid Theme
function isTheme(value: string): value is Theme {
  return ALL_THEMES.includes(value as Theme);
}

// Helper to build full logo URL
function resolveLogoUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // If backend already returns absolute URL, just return it
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Otherwise prepend backend base URL (adjust to your setup)
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  return `${baseUrl}${path}`;
}

export default function Customization() {
  const { user } = useAuth();
  const { themeName, setThemeName } = useThemeContext();

  const [themeId, setThemeId] = useState<number | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomization = async () => {
      if (!user?.adminResponse?.universityId) return;

      try {
        const data: CustomizationResponse = await getTheme(
          Number(user.adminResponse.universityId)
        );

        console.log("[Customization] Loaded theme from API:", data.themeName);

        const safeTheme = isTheme(data.themeName)
          ? data.themeName
          : "light";

        setThemeId(data.customizationid);
        setThemeName(safeTheme);
        setAboutText(data.aboutText);
        setLogoPreview(resolveLogoUrl(data.logoUrl));
      } catch (error) {
        console.error("Failed to load customization", error);
        setThemeId(undefined);
      }
    };

    fetchCustomization();
  }, [setThemeName, user?.adminResponse?.universityId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (NORMAL_THEMES.includes(selected as Theme)) {
      setThemeName(selected as Theme);
    }
  };

  const handleSave = async () => {
    if (!user?.adminResponse?.universityId) {
      console.error("Missing university ID. Cannot save customization.");
      return;
    }

    setLoading(true);
    try {
      const request: CustomizationRequest = {
        themeName,
        aboutText,
        logoFile: logoFile || undefined,
        universityId: Number(user.adminResponse.universityId),
      };

      const response = await saveOrUpdateTheme(request);

      setThemeId(response.customizationid);
      setLogoPreview(resolveLogoUrl(response.logoUrl));
      setLogoFile(null);

      console.log("[Customization] Saved successfully", response);
    } catch (err) {
      console.error("Failed to save customization", err);
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = themeName === "super_admin";

  return (
    <div
      className="p-6 rounded-xl shadow-md border card-theme"
      style={{ backgroundColor: "var(--card-color)" }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Paintbrush
          className="w-5 h-5"
          style={{ color: "var(--button-color)" }}
        />
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--text-color)" }}
        >
          Site Customization
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo Upload Section */}
        <div className="w-full md:w-1/3 space-y-3">
          <Label
            htmlFor="logo"
            className="text-sm"
            style={{ color: "var(--muted-text-color)" }}
          >
            Upload Logo
          </Label>
          <div
            className="w-full h-40 border rounded-lg flex items-center justify-center overflow-hidden mt-1"
            style={{
              backgroundColor: "var(--divider-color)",
              borderColor: "var(--divider-color)",
            }}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-full object-contain"
              />
            ) : (
              <span
                className="text-sm"
                style={{ color: "var(--muted-text-color)" }}
              >
                Image Preview
              </span>
            )}
          </div>
          <FileInput
            id="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 w-full"
          />
        </div>

        {/* Theme + About Section */}
        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <Label
              htmlFor="theme"
              className="text-sm"
              style={{ color: "var(--muted-text-color)" }}
            >
              Choose Theme
            </Label>
            <Select
              id="theme"
              value={themeName}
              onChange={handleThemeChange}
              className="mt-1 w-full"
              disabled={isSuperAdmin}
            >
              {NORMAL_THEMES.map((theme) => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() +
                    theme.slice(1).replace("_", " ")}
                </option>
              ))}
            </Select>
            {isSuperAdmin && (
              <p className="text-xs mt-1 text-red-600">
                Theme is fixed for Super Admin and cannot be changed here.
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="about"
              className="text-sm"
              style={{ color: "var(--muted-text-color)" }}
            >
              About Section
            </Label>
            <Textarea
              id="about"
              placeholder="Enter mission / vision / about..."
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={6}
              className="mt-1 w-full"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 text-right">
        <Button
          style={{
            backgroundColor: "var(--button-color)",
            color: "white",
          }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Customization"}
        </Button>
      </div>
    </div>
  );
}
