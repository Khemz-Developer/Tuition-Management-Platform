export interface GeneralSettings {
    platformName: string;
    supportEmail: string;
    description: string;
    teacherAutoApproval: boolean;
    allowStudentRegistration: boolean;
}

export interface BrandingSettings {
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor: string;
    accentColor: string;
}

export interface DynamicConfig {
    generalSettings?: GeneralSettings;
    brandingSettings?: BrandingSettings;
    // Add other settings as needed
}
