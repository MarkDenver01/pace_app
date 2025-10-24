import { useEffect, useState } from "react";
import {
  saveCareer,
  getCareersByCourse,
  updateCareer,
  deleteCareer,
} from "../../../libs/ApiResponseService";

interface Career {
  careerId: number;
  careerName: string;
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

  // Load existing careers
  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      try {
        const data = await getCareersByCourse(courseId);
        setCareers(data);
      } catch (err) {
        setError("Failed to load careers");
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, [courseId]);

  // Create a new career
  const handleSave = async () => {
    if (!careerName.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const newCareer = await saveCareer(courseId, careerName);
      setCareers((prev) => [...prev, newCareer]);
      setCareerName("");
    } catch {
      setError("Failed to save career");
    } finally {
      setSaving(false);
    }
  };

  // Enable edit mode
  const handleEdit = (career: Career) => {
    setEditingCareerId(career.careerId);
    setEditingName(career.careerName);
  };

  // Save edited career
  const handleUpdate = async (careerId: number) => {
    if (!editingName.trim()) return;
    try {
      const updated = await updateCareer(careerId, editingName);
      setCareers((prev) =>
        prev.map((c) => (c.careerId === careerId ? updated : c))
      );
      setEditingCareerId(null);
      setEditingName("");
    } catch {
      setError("Failed to update career");
    }
  };

  // Delete career
  const handleDelete = async (careerId: number) => {
    if (!window.confirm("Are you sure you want to delete this career?")) return;
    try {
      await deleteCareer(careerId);
      setCareers((prev) => prev.filter((c) => c.careerId !== careerId));
    } catch {
      setError("Failed to delete career");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Manage Careers</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Add new career */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter new career name"
          value={careerName}
          onChange={(e) => setCareerName(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={handleSave}
          disabled={saving || !careerName.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add"}
        </button>
      </div>

      <hr className="my-4" />

      {/* Career List */}
      <h3 className="font-medium mb-2">Existing Careers</h3>
      {loading ? (
        <p>Loading...</p>
      ) : careers.length > 0 ? (
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {careers.map((c) => (
            <li
              key={c.careerId}
              className="border p-2 rounded-md flex justify-between items-center"
            >
              {editingCareerId === c.careerId ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 border rounded-md px-2 py-1"
                  />
                  <button
                    onClick={() => handleUpdate(c.careerId)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCareerId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{c.careerName}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.careerId)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No careers found for this course.</p>
      )}

      <button
        onClick={onClose}
        className="mt-4 text-gray-600 hover:text-gray-900 font-medium"
      >
        Close
      </button>
    </div>
  );
}
