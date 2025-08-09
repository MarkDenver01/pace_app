import { useState, useEffect } from "react";
import { TabletsIcon, Trash2Icon, PencilIcon, SaveIcon, XIcon, School2Icon, SchoolIcon } from "lucide-react";
import { Button, Label, Pagination, TextInput, Spinner, Alert } from "flowbite-react";
import { 
  getUniversities, 
  addUniversity, 
  updateUniversity, 
  deleteUniversity 
} from "../../../libs/ApiResponseService";
import type { UniversityResponse, UniversityRequest } from "../../../libs/models/University";
import ThemedButton from "../../../components/ThemedButton";

export default function UniversityLayout() {
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [university, setUniversity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const pageSize = 5;
  const totalPages = Math.ceil(universities.length / pageSize);
  const paginatedUniversity = universities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUniversities();
      setUniversities(data);
    } catch (err: any) {
      setError(err.message || "Failed to load universities");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!university.trim()) {
      setError("Please enter a university name.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const newUni: UniversityRequest = { universityName: university.trim() };
      const savedUni = await addUniversity(newUni);
      setUniversities((prev) => [...prev, savedUni]);
      setUniversity("");
      setCurrentPage(Math.ceil((universities.length + 1) / pageSize));
    } catch (err: any) {
      setError(err.message || "Failed to save university");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditId(id);
    setEditName(name);
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) {
      setError("University name cannot be empty.");
      return;
    }

    try {
      const updated = await updateUniversity(id, { universityName: editName.trim() });
      setUniversities((prev) =>
        prev.map((u) => (u.universityId === id ? updated : u))
      );
      setEditId(null);
      setEditName("");
    } catch (err: any) {
      setError(err.message || "Failed to update university");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this university?")) return;

    try {
      await deleteUniversity(id);
      setUniversities((prev) => prev.filter((u) => u.universityId !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete university");
    }
  };

  const cardClass =
    "flex flex-col gap-4 p-6 rounded-2xl shadow-md card-theme border";
  const iconWrapperStyle = {
    backgroundColor: "var(--button-color, #D94022)10",
    color: "var(--button-color)",
  };
  const labelStyle = { color: "var(--button-color)" };
  const valueStyle = { color: "var(--text-color)" };

  return (
    <div className="p-4 flex flex-col gap-8">
      <h2 className="text-2xl font-bold" style={valueStyle}>
        University Management
      </h2>

      {error && <Alert color="failure">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h3 className="text-lg font-semibold" style={valueStyle}>
            Add University
          </h3>
          <div>
            <Label htmlFor="university" className="text-sm" style={valueStyle}>
              University
            </Label>
            <TextInput
              id="university"
              placeholder="Enter university..."
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex justify-center pt-2">
            <ThemedButton onClick={handleSave} loading={saving} >Save</ThemedButton>
          </div>
        </div>

        {/* University List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={iconWrapperStyle}>
              <SchoolIcon size={20} />
            </div>
            <h3 className="text-lg font-semibold" style={labelStyle}>
              University List
            </h3>
          </div>

          <div className="overflow-auto border rounded-xl">
            {loading ? (
              <div className="p-6 flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <table className="min-w-full text-sm text-left" style={valueStyle}>
                <thead
                  style={{
                    backgroundColor: "var(--button-color)",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th className="p-3 font-medium">ID</th>
                    <th className="p-3 font-medium">University</th>
                    <th className="p-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "var(--card-color)" }}>
                  {paginatedUniversity.length > 0 ? (
                    paginatedUniversity.map((u) => (
                      <tr
                        key={u.universityId}
                        className="hover:bg-[#FFEFEA] dark:hover:bg-gray-700 transition"
                      >
                        <td className="p-3">{u.universityId}</td>
                        <td className="p-3">
                          {editId === u.universityId ? (
                            <TextInput
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          ) : (
                            u.universityName
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            {editId === u.universityId ? (
                              <>
                              <ThemedButton
                                size="xs"
                                onClick={() => handleUpdate(u.universityId)}
                                bgColor="#1c6a1fff"
                                textColor="#fff"
                                padding="0.75rem 3rem" 
                                borderRadius="1rem">
                                  Update
                              </ThemedButton>
                              
                              <ThemedButton
                                size="xs"
                                onClick={() => setEditId(null)}
                                bgColor="#ea2e21ff"
                                textColor="#fff"
                                padding="0.75rem 3rem" 
                                borderRadius="1rem">
                                  Cancel
                                </ThemedButton>
                              </>
                            ) : (
                              <>
                              <ThemedButton
                                size="xs"
                                onClick={() => handleEdit(u.universityId, u.universityName)}
                                bgColor="#3a84ebff"
                                textColor="#fff"
                                padding="0.75rem 3rem" 
                                borderRadius="1rem">
                                  Edit
                              </ThemedButton>
                              <ThemedButton
                                size="xs"
                                onClick={() => handleDelete(u.universityId)}
                                bgColor="#ea2e21ff"
                                textColor="#fff"
                                padding="0.75rem 3rem" 
                                borderRadius="1rem">
                                 Delete
                              </ThemedButton>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No University found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showIcons
            />
          )}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--divider-color)" }} />
    </div>
  );
}
