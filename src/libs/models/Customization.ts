export interface CustomizationResponse {
  id: number;
  logoUrl: string;
  themeName: string;
  aboutText: string;
}

export interface CustomizationRequest {
  themeName: string;
  aboutText: string;
  logoFile?: File;
}
