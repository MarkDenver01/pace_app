import { useEffect, useState } from "react";
import { ChevronUpSquareIcon } from "lucide-react";
import { Button, Label, Pagination, Select, TextInput, Spinner, Modal } from "flowbite-react";
import {
  getUniversities,
  saveAccount,
  getAccounts,
  toggleAdminStatus,
  deleteAdminAccount,
} from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type { UserAccountRequest, UserAccountResponse } from "../../../libs/models/UserAccount";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";
import ThemedButton from "../../../components/ThemedButton";
import EditUserForm from "../../superadmin/admin_account/EditUserForm";

export default function AdminUserLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<UserAccountResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserAccountResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const pageSize = 5;
  const accentColor = "var(--button-color, #D94022)";

  /** Fetch universities */
  const fetchUniversities = async () => {
    setLoadingUnis(true);
    try {
      const data = await getUniversities();
      setUniversities(data);
    } finally {
      setLoadingUnis(false);
    }
  };

  /** Fetch users */
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getAccounts();
      setUsers(data);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchUsers();
  }, []);

  const generateTempPassword = () => {
    const pwd = Math.random().toString(36).slice(-8);
    setTempPassword(pwd);
  };

  const handleSave = async () => {
    if (!selectedUniversity || !username.trim() || !email.trim() || !tempPassword.trim()) {
      Swal.fire({ icon: "warning", title: "Fields Empty", text: "Please fill in all fields.", confirmButtonText: "CLOSE", ...getSwalTheme() });
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
      Swal.fire({ icon: "success", title: "Account Created", text: "Account has been successfully created.", confirmButtonText: "CLOSE", ...getSwalTheme() });
      setSelectedUniversity(""); setUsername(""); setEmail(""); setTempPassword("");
      await fetchUsers();
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Failed", text: "Account creation failed.", confirmButtonText: "CLOSE", ...getSwalTheme() });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (adminId: number) => {
    try {
      await toggleAdminStatus(adminId);
      Swal.fire({ icon: "success", title: "Status Updated", text: "Admin account status changed successfully.", confirmButtonText: "CLOSE", ...getSwalTheme() });
      await fetchUsers();
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message || "Failed to toggle account status.", confirmButtonText: "CLOSE", ...getSwalTheme() });
    }
  };

  const handleDeleteAccount = async (email: string) => {
    try {
      await deleteAdminAccount(email);
      Swal.fire({ icon: "success", title: "Deleted", text: "Admin account has been deleted.", confirmButtonText: "CLOSE", ...getSwalTheme() });
      await fetchUsers();
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message || "Failed to delete account.", confirmButtonText: "CLOSE", ...getSwalTheme() });
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

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Add User Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-600">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="university">University</Label>
            {loadingUnis ? (
              <div className="mt-2 flex items-center gap-2"><Spinner size="sm" /> Loading...</div>
            ) : (
              <Select id="university" value={selectedUniversity} onChange={(e) => setSelectedUniversity(Number(e.target.value))}>
                <option value="">Select a university...</option>
                {universities.map((uni) => <option key={uni.universityId} value={uni.universityId}>{uni.universityName}</option>)}
              </Select>
            )}
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <TextInput id="username" placeholder="Enter username..." value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" placeholder="Enter email..." value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tempPassword">Temporary Password</Label>
            <div className="flex gap-2">
              <TextInput id="tempPassword" value={tempPassword} readOnly placeholder="Auto-generated password" />
              <Button color="dark" onClick={generateTempPassword}>Generate</Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button disabled={loading} style={{ backgroundColor: accentColor }} className="text-white font-medium px-6" onClick={handleSave}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </div>
      </div>

      {/* User Table */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
            <ChevronUpSquareIcon size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">User Account List</h3>
        </div>
        <TextInput type="text" placeholder="Search by name, email, or university..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-64 border border-orange-600 rounded-lg mb-4" />
        <div className="overflow-hidden rounded-lg shadow border border-orange-600">
          <table className="min-w-full text-sm">
            <thead style={{ backgroundColor: accentColor }} className="text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">University</th>
                <th className="px-4 py-3 text-left font-medium">Username</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Account Status</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                <tr key={user.adminId} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{user.adminId}</td>
                  <td className="px-4 py-3">{user.universityName}</td>
                  <td className="px-4 py-3">{user.userName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.accountStatus}</td>
                 <td className="px-4 py-3">
  <div className="flex flex-col gap-2">
    {user.accountStatus === "PENDING" ? (
      <>
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
      </>
    ) : (
      <>
        <ThemedButton
          size="xs"
          onClick={() => handleToggleStatus(user.adminId)}
          bgColor={user.accountStatus === "ACTIVATE" || user.accountStatus === "VERIFIED" ? "#ea2e21ff" : "#1c6a1fff"}
          textColor="#fff"
          padding="0.5rem 1rem"
          borderRadius="0.5rem"
        >
          {user.accountStatus === "ACTIVATE" || user.accountStatus === "VERIFIED" ? "DEACTIVATE" : "ACTIVATE"}
        </ThemedButton>
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
      </>
    )}
  </div>
</td>

                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, users.length)} of {users.length} entries
            </span>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showIcons />
          </div>
        )}
      </div>

      <Modal show={isEditModalOpen} onClose={closeEditModal} popup>
        {editingUser && (
          <div className="p-6" style={{ minWidth: "400px" }}>
            <EditUserForm user={editingUser} universities={universities} onCancel={closeEditModal} onSuccess={onEditSuccess} />
          </div>
        )}
      </Modal>
    </div>
  );
}
