export interface CustomizationResponse {
  id: number;
  logoUrl: string;
  themeName: string;
  aboutText: string;
}

export interface CustomizationRequest {
    id?: number; // Make id an optional property
    themeName: string;
    aboutText: string;
    logoFile?: File;
}
