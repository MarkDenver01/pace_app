import { useState } from "react";
import { Select, Button } from "flowbite-react";
import { School2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const universityData = {
  "University A": 15,
  "University B": 12,
  "University C": 8,
  "University D": 19,
} as const;

type UniversityName = keyof typeof universityData;

export default function SuperRecordsPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityName>("University A");
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/superadmin/records/view?university=${encodeURIComponent(selectedUniversity)}`);
  };

  // Themed shared styles
  const cardClass =
    "w-full flex flex-col justify-between gap-2 p-6 rounded-2xl shadow-md hover:shadow-lg transition card-theme border";
  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };
  const labelStyle = {
    color: "var(--button-color)",
  };
  const valueStyle = {
    color: "var(--text-color)",
  };
  const descStyle = {
    color: "var(--muted-text-color, #6b7280)",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold" style={valueStyle}>
          Records
        </h2>
        <Select
          value={selectedUniversity}
          onChange={(e) => setSelectedUniversity(e.target.value as UniversityName)}
          className="w-64"
        >
          {Object.keys(universityData).map((univ) => (
            <option key={univ} value={univ}>
              {univ}
            </option>
          ))}
        </Select>
      </div>

      {/* Themed Card */}
      <div className={cardClass}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={iconWrapperStyle}>
            <School2 size={24} />
          </div>
          <h3 className="text-sm font-semibold" style={labelStyle}>
            {selectedUniversity}
          </h3>
        </div>

        {/* Value */}
        <div className="mt-4">
          <p className="text-sm font-medium" style={descStyle}>
            Active Courses
          </p>
          <p className="text-4xl font-bold mt-1" style={valueStyle}>
            {universityData[selectedUniversity]}
          </p>
        </div>

        {/* Divider */}
        <hr className="my-4" style={{ borderColor: "var(--divider-color)" }} />

        {/* Button */}
        <div className="flex justify-end">
          <Button
            style={{
              backgroundColor: "var(--button-color)",
              color: "white",
              fontWeight: 600,
              padding: "0.5rem 1.5rem",
              borderRadius: "0.5rem",
              minWidth: "100px",
            }}
            onClick={handleViewClick}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
