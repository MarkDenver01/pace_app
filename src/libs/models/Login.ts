import type { UserAccountResponse } from "../../libs/models/UserAccount";

export interface LoginResponse {
  jwtToken: string;
  username: string;
  role: string;
  adminResponse: UserAccountResponse;
}

export interface LoginRequest {
    email: string;
    password: string;
}   
