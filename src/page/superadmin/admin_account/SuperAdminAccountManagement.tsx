import { useEffect, useState } from "react";
import { ChevronUpSquareIcon } from "lucide-react";
import { Button, Label, Pagination, Select, TextInput, Spinner } from "flowbite-react";
import {
  getUniversities,
  saveAccount,
  getAccounts,
} from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type {
  UserAccountRequest,
  UserAccountResponse,
} from "../../../libs/models/UserAccount";

export default function AdminUserLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [errorUnis, setErrorUnis] = useState<string | null>(null);

  const [users, setUsers] = useState<UserAccountResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  const pageSize = 5;
  const accentColor = "var(--button-color, #D94022)";

  /** Fetch universities */
  const fetchUniversities = async () => {
    setLoadingUnis(true);
    try {
      const data = await getUniversities();
      setUniversities(data);
    } catch (error: any) {
      setErrorUnis(error.message || "Failed to fetch universities");
    } finally {
      setLoadingUnis(false);
    }
  };

  /** Fetch users */
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getAccounts();
      setUsers(data as UserAccountResponse[]);
    } catch (error: any) {
      setErrorUsers(error.message || "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  /** Initial fetch */
  useEffect(() => {
    fetchUniversities();
    fetchUsers();
  }, []);

  /** Generate random password */
  const generateTempPassword = () => {
    const pwd = Math.random().toString(36).slice(-8);
    setTempPassword(pwd);
  };

  /** Save account */
  const handleSave = async () => {
    if (
      !selectedUniversity ||
      !username.trim() ||
      !email.trim() ||
      !tempPassword.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const newAccount: UserAccountRequest = {
      username: username.trim(),
      email: email.trim(),
      role: "ADMIN",
      password: tempPassword.trim(),
      universityId: selectedUniversity as number,
    };

    try {
      await saveAccount(newAccount);
      alert("User saved successfully!");
      await fetchUsers(); // Refresh table from backend

      // Reset form
      setSelectedUniversity("");
      setUsername("");
      setEmail("");
      setTempPassword("");
    } catch (error: any) {
      alert(error.message || "Failed to save user");
    }
  };

  /** Pagination logic */
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Add User Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New User</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* University */}
          <div>
            <Label htmlFor="university">University</Label>
            {loadingUnis ? (
              <div className="mt-2 flex items-center gap-2">
                <Spinner size="sm" /> <span>Loading...</span>
              </div>
            ) : errorUnis ? (
              <p className="text-red-500 mt-1">{errorUnis}</p>
            ) : (
              <Select
                id="university"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(Number(e.target.value))}
              >
                <option value="">Select a university...</option>
                {universities.map((uni) => (
                  <option key={uni.universityId} value={uni.universityId}>
                    {uni.universityName}
                  </option>
                ))}
              </Select>
            )}
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username">User Name</Label>
            <TextInput
              id="username"
              placeholder="Enter user name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              placeholder="Enter email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Temporary Password */}
          <div>
            <Label htmlFor="tempPassword">Temporary Password</Label>
            <div className="flex gap-2">
              <TextInput
                id="tempPassword"
                value={tempPassword}
                readOnly
                placeholder="Auto-generated password"
              />
              <Button color="dark" onClick={generateTempPassword}>
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button
            style={{ backgroundColor: accentColor }}
            className="text-white font-medium px-6"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>

      {/* User List */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="p-2 rounded-full"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            <ChevronUpSquareIcon size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">User Account List</h3>
        </div>

        {loadingUsers ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" /> <span>Loading users...</span>
          </div>
        ) : errorUsers ? (
          <p className="text-red-500">{errorUsers}</p>
        ) : (
          <div className="overflow-hidden rounded-lg shadow border border-gray-100">
            <table className="min-w-full text-sm">
              <thead
                style={{ backgroundColor: accentColor }}
                className="text-white"
              >
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">University</th>
                  <th className="px-4 py-3 text-left font-medium">Username</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, idx) => (
                    <tr
                      key={user.adminId}
                      className={`hover:bg-gray-50 transition ${
                        idx % 2 === 0 ? "bg-gray-50/50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">{user.adminId}</td>
                      <td className="px-4 py-3">{user.universityName}</td>
                      <td className="px-4 py-3">{user.userName}</td>
                      <td className="px-4 py-3">{user.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * pageSize, users.length)}
              </span>{" "}
              of <span className="font-semibold">{users.length}</span> entries
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showIcons
            />
          </div>
        )}
      </div>
    </div>
  );
}
