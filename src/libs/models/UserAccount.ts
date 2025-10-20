export interface UserAccountResponse {
    adminId: number;
    userName: string;
    email: string;
    createdAt: string,
    accountStatus: string,
    universityId: number;
    universityName: string;
    userId: number;
    domainEmail: string;
}

export interface UserAccountRequest {
  username: string;
  email: string;
  role: string;
  password: string;
  universityId: number;
}