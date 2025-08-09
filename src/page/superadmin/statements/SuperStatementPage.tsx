import { useState, useEffect } from "react";
import { Button, Label, Textarea, Pagination, Select, Alert, Spinner } from "flowbite-react";
import { PencilIcon, TrashIcon } from "lucide-react";

// Dummy data type
type Statement = {
  id: number;
  category: string;
  content: string;
};

const categories = ["General Interest", "Career Interest", "Personal Qualities"];

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState("");
  const [newContent, setNewContent] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editContent, setEditContent] = useState("");

  // Pagination
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(statements.length / pageSize);
  const paginatedStatements = statements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // TODO: Replace with actual API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStatements([
        { id: 1, category: "General Interest", content: "Why do you want to study this course?" },
        { id: 2, category: "Career Interest", content: "What motivates you to pursue this career?" },
        // Add more dummy data if needed
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const resetNewForm = () => {
    setNewCategory("");
    setNewContent("");
  };

  const handleAdd = () => {
    if (!newCategory || !newContent.trim()) {
      setError("Category and content are required.");
      return;
    }
    setSaving(true);
    setError(null);

    // Simulate save API call
    setTimeout(() => {
      const newStatement = {
        id: Math.max(0, ...statements.map((s) => s.id)) + 1,
        category: newCategory,
        content: newContent.trim(),
      };
      setStatements((prev) => [...prev, newStatement]);
      resetNewForm();
      setSaving(false);
      setCurrentPage(totalPages); // Jump to last page
    }, 800);
  };

  const handleEdit = (statement: Statement) => {
    setEditId(statement.id);
    setEditCategory(statement.category);
    setEditContent(statement.content);
  };

  const handleUpdate = () => {
    if (!editCategory || !editContent.trim()) {
      setError("Category and content are required.");
      return;
    }
    setSaving(true);
    setError(null);

    setTimeout(() => {
      setStatements((prev) =>
        prev.map((s) =>
          s.id === editId ? { ...s, category: editCategory, content: editContent.trim() } : s
        )
      );
      setEditId(null);
      setEditCategory("");
      setEditContent("");
      setSaving(false);
    }, 800);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this statement?")) return;
    setStatements((prev) => prev.filter((s) => s.id !== id));
  };

  const cardClass =
    "flex flex-col gap-4 p-6 rounded-2xl shadow-md card-theme border";
  const labelStyle = { color: "var(--button-color)" };
  const valueStyle = { color: "var(--text-color)" };

  return (
    <div className="p-4 flex flex-col gap-8">
      <h2 className="text-2xl font-bold" style={valueStyle}>
        Statement Management
      </h2>

      {error && <Alert color="failure">{error}</Alert>}

      {/* Add new statement */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold" style={valueStyle}>
          Add New Statement
        </h3>
        <div>
          <Label htmlFor="category" className="mb-1" style={labelStyle}>
            Category
          </Label>
          <Select
            id="category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <Label htmlFor="content" className="mb-1" style={labelStyle}>
            Statement / Question
          </Label>
          <Textarea
            id="content"
            rows={4}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Enter statement or question"
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={handleAdd} disabled={saving} >
            {saving ? "Saving..." : "Add Statement"}
          </Button>
        </div>
      </div>

      {/* List and paginate statements */}
      <div className={cardClass}>
        <h3 className="text-lg font-semibold mb-4" style={valueStyle}>
          Existing Statements
        </h3>

        {loading ? (
          <div className="flex justify-center p-6"><Spinner size="lg" /></div>
        ) : paginatedStatements.length === 0 ? (
          <p style={valueStyle}>No statements available.</p>
        ) : (
          <table className="min-w-full text-left text-sm" style={{ color: "var(--text-color)" }}>
            <thead style={{ backgroundColor: "var(--button-color)", color: "#fff" }}>
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">Statement</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "var(--card-color)" }}>
              {paginatedStatements.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-[#FFEFEA] dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3">{s.id}</td>
                  <td className="p-3">
                    {editId === s.id ? (
                      <Select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Select>
                    ) : (
                      s.category
                    )}
                  </td>
                  <td className="p-3">
                    {editId === s.id ? (
                      <Textarea
                        rows={2}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                    ) : (
                      s.content
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {editId === s.id ? (
                      <>
                        <Button size="xs" onClick={handleUpdate} disabled={saving} className="mr-2">
                          Save
                        </Button>
                        <Button size="xs" color="failure" onClick={() => setEditId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="xs" onClick={() => handleEdit(s)}>
                          <PencilIcon size={14} />
                        </Button>
                        <Button size="xs" color="failure" onClick={() => handleDelete(s.id)}>
                          <TrashIcon size={14} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
}
