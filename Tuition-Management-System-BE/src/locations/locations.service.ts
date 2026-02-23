import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const RAPIDAPI_HOST = 'sri-lankan-provinces-districts-and-cities1.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}/api/v1/locations`;

@Injectable()
export class LocationsService {
  constructor(private readonly configService: ConfigService) {}

  private getHeaders(): HeadersInit {
    const key = this.configService.get<string>('RAPIDAPI_KEY');
    if (!key) {
      throw new Error('RAPIDAPI_KEY is not configured. Add it to .env to use Sri Lanka locations API.');
    }
    return {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': key,
    };
  }

  private async fetchApi<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(path, BASE_URL);
    if (params) {
      Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString(), { headers: this.getHeaders() });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Locations API error ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  }

  /** Normalize API response to string array (handles array of strings or array of { name } objects) */
  private toNamesList(data: unknown): string[] {
    if (!Array.isArray(data)) return [];
    return data.map((item) => (typeof item === 'string' ? item : (item as { name?: string })?.name ?? String(item))).filter(Boolean);
  }

  async getProvinces(): Promise<string[]> {
    try {
      const data = await this.fetchApi<unknown>('/provinces');
      return this.toNamesList(Array.isArray(data) ? data : (data as { data?: unknown })?.data ?? []);
    } catch (e) {
      console.error('LocationsService.getProvinces failed:', e);
      throw e;
    }
  }

  async getDistricts(province: string): Promise<string[]> {
    if (!province?.trim()) return [];
    try {
      const data = await this.fetchApi<unknown>('/districts', { province: province.trim() });
      return this.toNamesList(Array.isArray(data) ? data : (data as { data?: unknown })?.data ?? []);
    } catch (e) {
      console.error('LocationsService.getDistricts failed:', e);
      throw e;
    }
  }

  async getCities(district: string): Promise<string[]> {
    if (!district?.trim()) return [];
    try {
      const data = await this.fetchApi<unknown>('/city', { district: district.trim() });
      return this.toNamesList(Array.isArray(data) ? data : (data as { data?: unknown })?.data ?? []);
    } catch (e) {
      console.error('LocationsService.getCities failed:', e);
      throw e;
    }
  }
}
