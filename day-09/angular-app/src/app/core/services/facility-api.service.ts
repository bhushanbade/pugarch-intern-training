import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResource,
  Complaint,
  CreateInspectionRequest,
  Facility,
  Inspection,
  PaginatedResponse,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class FacilityApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

  getFacilities(): Observable<Facility[]> {
    return this.getAllPages<Facility>('facilities');
  }

  getFacility(id: number): Observable<Facility> {
    return this.http
      .get<ApiResource<Facility>>(`${this.baseUrl}/facilities/${id}`)
      .pipe(map((response) => response.data));
  }

  getInspections(): Observable<Inspection[]> {
    return this.getAllPages<Inspection>('inspections');
  }

  getComplaints(): Observable<Complaint[]> {
    return this.getAllPages<Complaint>('complaints');
  }

  createInspection(request: CreateInspectionRequest): Observable<Inspection> {
    return this.http
      .post<ApiResource<Inspection>>(`${this.baseUrl}/inspections`, request)
      .pipe(map((response) => response.data));
  }

  private getAllPages<T>(resource: string): Observable<T[]> {
    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}/${resource}`).pipe(
      expand((page) =>
        page.meta.current_page < page.meta.last_page
          ? this.http.get<PaginatedResponse<T>>(`${this.baseUrl}/${resource}`, {
              params: { page: page.meta.current_page + 1 },
            })
          : EMPTY,
      ),
      reduce((items, page) => items.concat(page.data), [] as T[]),
    );
  }
}
