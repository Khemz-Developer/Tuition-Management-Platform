import { get, put } from './api'
import { DynamicConfig, GeneralSettings, BrandingSettings } from '../types/settings.types'

export const SettingsService = {
    getSettings: async (): Promise<DynamicConfig> => {
        return await get<DynamicConfig>('/admin/dynamic-config')
    },

    updateGeneralSettings: async (settings: GeneralSettings): Promise<DynamicConfig> => {
        return await put<DynamicConfig>('/admin/dynamic-config/settings/general', settings)
    },

    updateBrandingSettings: async (settings: BrandingSettings): Promise<DynamicConfig> => {
        return await put<DynamicConfig>('/admin/dynamic-config/settings/branding', settings)
    }
}
