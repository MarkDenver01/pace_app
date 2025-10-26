import { useEffect, useState } from "react";
import {
  saveCareer,
  getCareersByCourse,
  updateCareer,
  deleteCareer,
} from "../../../libs/ApiResponseService";
import ThemedButton from "../../../components/ThemedButton";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";

interface Career {
  careerId: number;
  career: string;
}

interface CareerModalProps {
  courseId: number;
  onClose: () => void;
}

export default function CareerModal({ courseId, onClose }: CareerModalProps) {
  const [careerName, setCareerName] = useState("");
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCareerId, setEditingCareerId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch existing careers
  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      try {
        const data = await getCareersByCourse(courseId);

        console.log("Fetched careers data:", data.careers);

        // Handle different API response shapes safely
        if (Array.isArray(data)) {
          setCareers(data);
        } else if (Array.isArray(data?.careers)) {
          setCareers(data.careers);
        } else {
          console.warn("Unexpected API response:", data);
          setCareers([]);
        }
      } catch (err) {
        console.error("Error fetching careers:", err);
        setError("Failed to load careers");
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, [courseId]);

  //  Add a new career
  const handleSave = async () => {
    if (!careerName.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const newCareer = await saveCareer(courseId, careerName);
      setCareers((prev) => [...prev, newCareer]);
      setCareerName("");

      Swal.fire({
        icon: "success",
        title: "Career Added",
        text: "Career has been successfully added.",
        confirmButtonText: "OK",
        ...getSwalTheme(),
      });
    } catch (err) {
      console.error("Save failed:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to save career.",
        confirmButtonText: "OK",
        ...getSwalTheme(),
      });
    } finally {
      setSaving(false);
    }
  };

  // ✅ Edit / Update career
  const handleEdit = (career: Career) => {
    setEditingCareerId(career.careerId);
    setEditingName(career.career);
  };

  const handleUpdate = async (careerId: number) => {
    if (!editingName.trim()) return;
    try {
      const updated = await updateCareer(careerId, editingName);
      setCareers((prev) =>
        prev.map((c) => (c.careerId === careerId ? updated : c))
      );
      setEditingCareerId(null);
      setEditingName("");

      Swal.fire({
        icon: "success",
        title: "Career Updated",
        text: "Career updated successfully.",
        confirmButtonText: "OK",
        ...getSwalTheme(),
      });
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to update career.",
        confirmButtonText: "OK",
        ...getSwalTheme(),
      });
    }
  };

  // ✅ Delete career
  const handleDelete = async (careerId: number) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Career?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      ...getSwalTheme(),
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteCareer(careerId);
      setCareers((prev) => prev.filter((c) => c.careerId !== careerId));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Career deleted successfully.",
        confirmButtonText: "OK",
        ...getSwalTheme(),
      });
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to delete career.",
        confirmButtonText: "OK",
        ...getSwalTheme(),
      });
    }
  };

  // ✅ Render
  return (
    <div className="p-6 bg-white text-gray-900 rounded-2xl shadow-lg max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Manage Careers</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Add new career */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter new career name"
          value={careerName}
          onChange={(e) => setCareerName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ThemedButton
          bgColor="var(--button-color)"
          textColor="#fff"
          onClick={handleSave}
          size="sm"
          borderRadius="0.5rem"
          disabled={saving || !careerName.trim()}
        >
          {saving ? "Saving..." : "Add"}
        </ThemedButton>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* Existing Careers */}
      <h3 className="font-medium mb-2 text-gray-700">Existing Careers</h3>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : careers.length > 0 ? (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {careers.map((c) => (
            <li
              key={c.careerId}
              className="border border-gray-300 p-2 rounded-md flex justify-between items-center bg-gray-50 text-gray-900"
            >
              {editingCareerId === c.careerId ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
                  />
                  <ThemedButton
                    bgColor="var(--button-color)"
                    textColor="#fff"
                    size="xs"
                    borderRadius="0.25rem"
                    onClick={() => handleUpdate(c.careerId)}
                  >
                    Save
                  </ThemedButton>
                  <ThemedButton
                    bgColor="#f3f4f6"
                    textColor="#111827"
                    size="xs"
                    borderRadius="0.25rem"
                    onClick={() => setEditingCareerId(null)}
                  >
                    Cancel
                  </ThemedButton>
                </div>
              ) : (
                <>
                  <span className="text-gray-900 font-medium">
                    {c.career || "(Unnamed Career)"}
                  </span>
                  <div className="flex gap-2">
                    <ThemedButton
                      bgColor="#fff"
                      textColor="#2563eb"
                      size="xs"
                      borderRadius="0.25rem"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </ThemedButton>
                    <ThemedButton
                      bgColor="#fff"
                      textColor="#dc2626"
                      size="xs"
                      borderRadius="0.25rem"
                      onClick={() => handleDelete(c.careerId)}
                    >
                      Delete
                    </ThemedButton>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No careers found for this course.</p>
      )}

      <div className="flex justify-end pt-4">
        <ThemedButton
          bgColor="#f3f4f6"
          textColor="#111827"
          onClick={onClose}
          size="sm"
          borderRadius="0.5rem"
        >
          Close
        </ThemedButton>
      </div>
    </div>
  );
}
