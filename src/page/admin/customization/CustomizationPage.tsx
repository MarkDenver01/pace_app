import { useState } from "react";
import {
  FileInput,
  Textarea,
  Select,
  Label,
  Button,
} from "flowbite-react";
import { Paintbrush } from "lucide-react";
import { useThemeContext } from "../../../context/ThemeContext";

// Define valid theme types
type Theme = "light" | "dark" | "redish" | "purplelish" | "brownish";

export default function CustomizationPage() {
  const [logo, setLogo] = useState<File | null>(null);
  const [aboutText, setAboutText] = useState("");

  const { themeName, setThemeName } = useThemeContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogo(file);
  };

  const handleSave = () => {
    alert("Customization saved!");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-6">
        <Paintbrush className="w-5 h-5 text-[#D94022]" />
        <h2 className="text-xl font-semibold text-gray-700">
          Site Customization
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Upload Logo */}
        <div className="w-full md:w-1/3 space-y-3">
          <div>
            <Label htmlFor="logo" className="text-sm text-gray-600">
              Upload Logo
            </Label>
            <div className="w-full h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mt-1">
              {logo ? (
                <img
                  src={URL.createObjectURL(logo)}
                  alt="Logo Preview"
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-sm text-gray-400">Image Preview</span>
              )}
            </div>
            <FileInput
              id="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 w-full"
            />
          </div>
        </div>

        {/* Right Column - Theme + About Section */}
        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <Label htmlFor="theme" className="text-sm text-gray-600">
              Choose Theme
            </Label>
            <Select
              id="theme"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value as Theme)}
              className="mt-1 w-full"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="redish">Redish</option>
              <option value="purplelish">Purplelish</option>
              <option value="brownish">Brownish</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="about" className="text-sm text-gray-600">
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
          style={{ backgroundColor: "var(--button-color)", color: "white" }}
          onClick={handleSave}
        >
          Save Customization
        </Button>
      </div>
    </div>
  );
}
