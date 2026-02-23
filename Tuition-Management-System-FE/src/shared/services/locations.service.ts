import { get } from './api'

const LOCATIONS_BASE = '/locations'

export const LocationsService = {
  getProvinces: async (): Promise<string[]> => {
    const data = await get<string[]>(`${LOCATIONS_BASE}/provinces`)
    return Array.isArray(data) ? data : []
  },

  getDistricts: async (province: string): Promise<string[]> => {
    if (!province?.trim()) return []
    const data = await get<string[]>(`${LOCATIONS_BASE}/districts?province=${encodeURIComponent(province.trim())}`)
    return Array.isArray(data) ? data : []
  },

  getCities: async (district: string): Promise<string[]> => {
    if (!district?.trim()) return []
    const data = await get<string[]>(`${LOCATIONS_BASE}/cities?district=${encodeURIComponent(district.trim())}`)
    return Array.isArray(data) ? data : []
  },
}
