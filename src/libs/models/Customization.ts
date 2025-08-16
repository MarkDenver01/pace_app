export interface CustomizationResponse {
  customizationid: number;
  logoUrl: string;
  themeName: string;
  aboutText: string;
  universityId: number;
}

export interface CustomizationRequest {
    themeName: string;
    aboutText: string;
    logoFile?: File;
    universityId: number;

}
