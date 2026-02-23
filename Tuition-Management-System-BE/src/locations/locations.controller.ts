import { Controller, Get, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Public } from '../decorators/public.decorator';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Public()
  @Get('provinces')
  async getProvinces() {
    return this.locationsService.getProvinces();
  }

  @Public()
  @Get('districts')
  async getDistricts(@Query('province') province: string) {
    return this.locationsService.getDistricts(province || '');
  }

  @Public()
  @Get('cities')
  async getCities(@Query('district') district: string) {
    return this.locationsService.getCities(district || '');
  }
}
