import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import type { ApiData, FacilityRecord, InspectionRecord } from './inspection.models';

@Injectable({ providedIn: 'root' })
export class InspectionApiService {
  private readonly http = inject(HttpClient);

  getInspections(): Observable<InspectionRecord[]> {
    return forkJoin({
      inspections: this.http.get<ApiData<InspectionRecord[]>>('/api/inspections'),
      facilities: this.http.get<ApiData<FacilityRecord[]>>('/api/facilities'),
    }).pipe(
      map(({ inspections, facilities }) => {
        const names = new Map(facilities.data.map((facility) => [facility.id, facility.name]));
        return inspections.data.map((inspection) => ({
          ...inspection,
          facility_name: names.get(inspection.facility_id) ?? inspection.facility_name,
        }));
      }),
    );
  }
}
