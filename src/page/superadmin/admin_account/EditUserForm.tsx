import { useState } from "react";
import { TextInput, Select, Label } from "flowbite-react";
import ThemedButton from "../../../components/ThemedButton";
import { updateAdmin } from "../../../libs/ApiResponseService";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../../utils/getSwalTheme";
import type { UserAccountResponse } from "../../../libs/models/UserAccount";
import type { UniversityResponse } from "../../../libs/models/University";

interface EditUserFormProps {
  user: UserAccountResponse;
  universities: UniversityResponse[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditUserForm({ user, universities, onCancel, onSuccess }: EditUserFormProps) {
  const [username, setUsername] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [universityId, setUniversityId] = useState(user.universityId);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !email || !universityId) {
      Swal.fire({ icon: "warning", title: "Fields Required", text: "Please fill all fields", confirmButtonText: "CLOSE", ...getSwalTheme() });
      return;
    }

    setLoading(true);
    try {
      await updateAdmin(user.adminId, { username, email, universityId });
      Swal.fire({ icon: "success", title: "Updated", text: "Account updated successfully", confirmButtonText: "CLOSE", ...getSwalTheme() }).then(() => onSuccess?.());
    } catch (e) {
      Swal.fire({ icon: "error", title: "Failed", text: "Failed to update account", confirmButtonText: "CLOSE", ...getSwalTheme() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Edit User</h3>

      <div>
        <Label>University</Label>
        <Select value={universityId} onChange={(e) => setUniversityId(Number(e.target.value))}>
          <option value="">Select a university</option>
          {universities.map((u) => (
            <option key={u.universityId} value={u.universityId}>{u.universityName}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Username</Label>
        <TextInput value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div>
        <Label>Email</Label>
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <ThemedButton onClick={onCancel} bgColor="#f3f4f6" textColor="#111827" borderRadius="0.5rem">Cancel</ThemedButton>
        <ThemedButton onClick={handleSubmit} loading={loading} bgColor="var(--button-color)" textColor="#fff" borderRadius="0.5rem">Update</ThemedButton>
      </div>
    </div>
  );
}
