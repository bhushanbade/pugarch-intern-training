import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiErrorService } from '../../core/services/api-error.service';
import { FacilityApiService } from '../../core/services/facility-api.service';
import { Facility, Inspection } from '../../core/models/api.models';
import { ConditionLabelPipe } from '../../shared/pipes/condition-label.pipe';
import { OperationalStatusDirective } from '../../shared/directives/operational-status.directive';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StateMessageComponent } from '../../shared/components/state-message/state-message.component';

@Component({
  selector: 'app-facility-detail-page',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ConditionLabelPipe,
    OperationalStatusDirective,
    PageHeaderComponent,
    StateMessageComponent,
  ],
  templateUrl: './facility-detail.page.html',
  styleUrl: './facility-detail.page.scss',
})
export class FacilityDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(FacilityApiService);
  private readonly apiErrors = inject(ApiErrorService);

  facility: Facility | null = null;
  inspections: Inspection[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => this.loadFacility(Number(params.get('id'))));
  }

  loadFacility(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    if (!Number.isInteger(id) || id < 1) {
      this.loading = false;
      this.errorMessage = 'The facility ID in this link is invalid.';
      return;
    }
    forkJoin({
      facility: this.api.getFacility(id),
      inspections: this.api.getInspections(),
    })
      .pipe(
        map(({ facility, inspections }) => ({
          facility,
          inspections: inspections.filter((inspection) => inspection.facility_id === facility.id),
        })),
        catchError((error: unknown) => {
          this.errorMessage = this.apiErrors.message(error);
          this.loading = false;
          return EMPTY;
        }),
      )
      .subscribe(({ facility, inspections }) => {
        this.facility = facility;
        this.inspections = inspections;
        this.loading = false;
      });
  }
}
