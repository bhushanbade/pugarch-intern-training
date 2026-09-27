import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FacilityApiService } from './facility-api.service';
import { Facility } from '../models/api.models';

const facility: Facility = {
  id: 1,
  department_id: 2,
  name: 'Central Library',
  category: 'Library',
  location: '100 Main Street',
  condition_score: 4,
  is_operational: true,
  notes: null,
  department: { id: 2, name: 'Operations' },
  created_at: '2026-01-01T00:00:00.000000Z',
  updated_at: '2026-01-01T00:00:00.000000Z',
};

describe('FacilityApiService', () => {
  let service: FacilityApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FacilityApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads every page from a Laravel paginated facility response', () => {
    let result: Facility[] = [];
    service.getFacilities().subscribe((facilities) => (result = facilities));

    http.expectOne('/api/facilities').flush({
      data: [facility],
      meta: { current_page: 1, last_page: 2, per_page: 15, total: 16 },
    });
    http.expectOne((request) => request.url === '/api/facilities' && request.params.get('page') === '2').flush({
      data: [{ ...facility, id: 2, name: 'East Community Center' }],
      meta: { current_page: 2, last_page: 2, per_page: 15, total: 16 },
    });

    expect(result.map((item) => item.name)).toEqual(['Central Library', 'East Community Center']);
  });
});
