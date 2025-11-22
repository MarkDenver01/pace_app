import { useEffect, useState } from "react";
import { ChevronUpSquareIcon } from "lucide-react";
import {
  Button,
  Label,
  Pagination,
  Select,
  TextInput,
  Spinner,
  Modal,
} from "flowbite-react";
import {
  getUniversities,
  saveAccount,
  getAccounts,
  toggleAdminStatus,
  deleteAdminAccount,
} from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type {
  UserAccountRequest,
  UserAccountResponse,
} from "../../../libs/models/UserAccount";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";
import ThemedButton from "../../../components/ThemedButton";
import EditUserForm from "../../superadmin/admin_account/EditUserForm";

type SortDirection = "asc" | "desc";
type SortableColumn =
  | "adminId"
  | "universityName"
  | "userName"
  | "email"
  | "accountStatus"
  | "role";

export default function AdminUserLayout() {
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  // Data
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [errorUnis, setErrorUnis] = useState<string | null>(null);

  const [users, setUsers] = useState<UserAccountResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUniversity, setFilterUniversity] = useState<string>(""); // uses universityName
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("");

  // Sorting
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Edit modal
  const [editingUser, setEditingUser] = useState<UserAccountResponse | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const pageSize = 5;
  const accentColor = "var(--button-color, #D94022)";

  // ===== Handlers for status / delete =====
  const handleToggleStatus = async (adminId: number) => {
    try {
      await toggleAdminStatus(adminId);
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Admin account status changed successfully.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      await fetchUsers(); // refresh table
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Failed to toggle account status.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
    }
  };

  const handleDeleteAccount = async (email: string) => {
    try {
      await deleteAdminAccount(email);
      Swal.fire({
        icon: "success",
        title: "Delete Account",
        text: "Admin account has been deleted.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      await fetchUsers(); // refresh table
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Failed to delete account.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
    }
  };

  // ===== API Calls =====
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

  useEffect(() => {
    fetchUniversities();
    fetchUsers();
  }, []);

  // ===== Helpers =====
  const generateTempPassword = () => {
    const pwd = Math.random().toString(36).slice(-8);
    setTempPassword(pwd);
  };

  const handleSave = async () => {
    if (
      !selectedUniversity ||
      !username.trim() ||
      !email.trim() ||
      !tempPassword.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Fields Empty",
        text: "Please fill in all fields.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      }).then(() => setLoading(false));
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
      setLoading(true);
      await saveAccount(newAccount);
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Account has been successfully created.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      }).then(() => setLoading(false));
      await fetchUsers();

      // Reset form
      setSelectedUniversity("");
      setUsername("");
      setEmail("");
      setTempPassword("");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Account creation failed.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      }).then(() => setLoading(false));
    }
  };

  const openEditModal = (user: UserAccountResponse) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setIsEditModalOpen(false);
  };

  const onEditSuccess = async () => {
    closeEditModal();
    await fetchUsers();
  };

  // ===== Filter options derived from data =====
  const universityFilterOptions = Array.from(
    new Set(users.map((u) => u.universityName))
  ).sort();

  const statusFilterOptions = ["PENDING", "VERIFIED", "ACTIVATE", "DEACTIVATE"];

  // ===== Filtering & Sorting Logic =====
  let filteredUsers = [...users];

  // Search
  if (searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.userName.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower) ||
        user.universityName.toLowerCase().includes(lower)
    );
  }

  // University filter
  if (filterUniversity) {
    filteredUsers = filteredUsers.filter(
      (user) => user.universityName === filterUniversity
    );
  }

  // Status filter
  if (filterStatus) {
    filteredUsers = filteredUsers.filter(
      (user) => user.accountStatus === filterStatus
    );
  }

  // Sorting
  const handleSort = (column: SortableColumn) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection("asc");
      return;
    }

    // same column clicked again ⇒ toggle / reset
    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      // third click: clear sort
      setSortColumn(null);
    }
  };

  if (sortColumn) {
    filteredUsers.sort((a, b) => {
      let valA = a[sortColumn as keyof UserAccountResponse];
      let valB = b[sortColumn as keyof UserAccountResponse];

      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  const totalEntries = filteredUsers.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderSortIndicator = (column: SortableColumn) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Add User Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-600">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Add New User
        </h3>

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
                onChange={(e) =>
                  setSelectedUniversity(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
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
            disabled={loading}
            style={{ backgroundColor: accentColor }}
            className="text-white font-medium px-6"
            onClick={handleSave}
          >
            {loading ? "Creating account..." : "Create Account"}
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
          <h3 className="text-lg font-semibold text-gray-700">
            User Account List
          </h3>
        </div>

        {loadingUsers ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" /> <span>Loading users...</span>
          </div>
        ) : errorUsers ? (
          <p className="text-red-500">{errorUsers}</p>
        ) : (
          <>
            {/* Filters row */}
            <div className="flex flex-wrap gap-3 mb-4 items-end">
              <div className="w-full md:w-64">
                <Label htmlFor="search">Search</Label>
                <TextInput
                  id="search"
                  type="text"
                  placeholder="Search by name, email, or university..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-orange-600 rounded-lg"
                />
              </div>

              <div className="w-full md:w-52">
                <Label htmlFor="filterUniversity">University</Label>
                <Select
                  id="filterUniversity"
                  value={filterUniversity}
                  onChange={(e) => {
                    setFilterUniversity(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All universities</option>
                  {universityFilterOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="w-full md:w-44">
                <Label htmlFor="filterStatus">Status</Label>
                <Select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All status</option>
                  {statusFilterOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg shadow border border-orange-600">
              <table className="min-w-full text-sm">
                <thead
                  style={{ backgroundColor: accentColor }}
                  className="text-white"
                >
                  <tr>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer select-none"
                      onClick={() => handleSort("adminId")}
                    >
                      ID{renderSortIndicator("adminId")}
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer select-none"
                      onClick={() => handleSort("universityName")}
                    >
                      University{renderSortIndicator("universityName")}
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer select-none"
                      onClick={() => handleSort("userName")}
                    >
                      Username{renderSortIndicator("userName")}
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer select-none"
                      onClick={() => handleSort("email")}
                    >
                      Email{renderSortIndicator("email")}
                    </th>
                    <th
                      className="px-4 py-3 text-left font-medium cursor-pointer select-none"
                      onClick={() => handleSort("accountStatus")}
                    >
                      Account Status{renderSortIndicator("accountStatus")}
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
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
                        <td className="px-4 py-3">{user.accountStatus}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2">

  {/* Always show EDIT */}
  <ThemedButton
    size="xs"
    onClick={() => openEditModal(user)}
    bgColor="#1c6a1fff"
    textColor="#fff"
    padding="0.5rem 1rem"
    borderRadius="0.5rem"
  >
    EDIT
  </ThemedButton>

  {/* Status Toggle */}
  <ThemedButton
    size="xs"
    onClick={() => handleToggleStatus(user.adminId)}
    bgColor={
      user.accountStatus === "ACTIVATE" || user.accountStatus === "VERIFIED"
        ? "#ea2e21ff"   // red → deactivate
        : "#1c6a1fff"  // green → activate
    }
    textColor="#fff"
    padding="0.5rem 1rem"
    borderRadius="0.5rem"
  >
    {user.accountStatus === "ACTIVATE" || user.accountStatus === "VERIFIED"
      ? "DEACTIVATE"
      : "ACTIVATE"}
  </ThemedButton>

  {/* DELETE */}
  <ThemedButton
    size="xs"
    onClick={() => handleDeleteAccount(user.email)}
    bgColor="#f00707ff"
    textColor="#fff"
    padding="0.5rem 1rem"
    borderRadius="0.5rem"
  >
    DELETE
  </ThemedButton>
</div>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <span>
                  Showing{" "}
                  <span className="font-semibold">
                    {totalEntries === 0
                      ? 0
                      : (currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(currentPage * pageSize, totalEntries)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">{totalEntries}</span> entries
                </span>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showIcons
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={isEditModalOpen} onClose={closeEditModal} popup>
        {editingUser && (
          <div className="p-6" style={{ minWidth: "400px" }}>
            <EditUserForm
              user={editingUser}
              universities={universities}
              onCancel={closeEditModal}
              onSuccess={onEditSuccess}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
