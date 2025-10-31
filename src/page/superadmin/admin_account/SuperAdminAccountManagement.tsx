import { useEffect, useState } from "react";
import { ChevronUpSquareIcon } from "lucide-react";
import { Button, Label, Pagination, Select, TextInput, Spinner, Modal } from "flowbite-react";
import {
  getUniversities,
  saveAccount,
  getAccounts,
  toggleAdminStatus,
  deleteAdminAccount,
  updateAdmin,
} from "../../../libs/ApiResponseService";
import type { UniversityResponse } from "../../../libs/models/University";
import type { UserAccountRequest, UserAccountResponse } from "../../../libs/models/UserAccount";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";
import ThemedButton from "../../../components/ThemedButton";
import EditUserForm from "../../superadmin/admin_account/EditUserForm"; // new component for modal form

export default function AdminUserLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUniversity, setSelectedUniversity] = useState<number | "">("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorUnis, setErrorUnis] = useState<string | null>(null);

  const [users, setUsers] = useState<UserAccountResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

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

  useEffect(() => {
    fetchUniversities();
    fetchUsers();
  }, []);

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
      await fetchUsers();
      setSelectedUniversity(""); setUsername(""); setEmail(""); setTempPassword("");
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Failed", text: "Account creation failed.", confirmButtonText: "CLOSE", ...getSwalTheme() });
    } finally {
      setLoading(false);
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
      {/* Add User Form... same as before */}
      {/* User List */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
            <ChevronUpSquareIcon size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">User Account List</h3>
        </div>

        {loadingUsers ? (
          <div className="flex items-center gap-2"><Spinner size="sm" /> <span>Loading users...</span></div>
        ) : errorUsers ? (
          <p className="text-red-500">{errorUsers}</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <TextInput
                type="text"
                placeholder="Search by name, email, or university..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-64 border border-orange-600 rounded-lg"
              />
            </div>

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
                          {user.accountStatus === "PENDING" && (
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
                          )}
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
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>
              Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(currentPage * pageSize, users.length)}</span> of{" "}
              <span className="font-semibold">{users.length}</span> entries
            </span>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} showIcons />
          </div>
        )}
      </div>

      {/* Edit User Modal */}
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
