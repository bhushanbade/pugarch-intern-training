import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiErrorService } from '../../core/services/api-error.service';
import { FacilityApiService } from '../../core/services/facility-api.service';
import { Facility, Inspection } from '../../core/models/api.models';
import { ConditionLabelPipe } from '../../shared/pipes/condition-label.pipe';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StateMessageComponent } from '../../shared/components/state-message/state-message.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, ConditionLabelPipe, PageHeaderComponent, StateMessageComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly api = inject(FacilityApiService);
  private readonly apiErrors = inject(ApiErrorService);

  facilities: Facility[] = [];
  inspections: Inspection[] = [];
  openComplaints = 0;
  averageRating = 0;
  loading = true;
  errorMessage = '';

  get recentInspections(): Inspection[] {
    return [...this.inspections]
      .sort((a, b) => b.inspected_at.localeCompare(a.inspected_at))
      .slice(0, 4);
  }

  get operationalCount(): number {
    return this.facilities.filter((facility) => facility.is_operational).length;
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';
    forkJoin({
      facilities: this.api.getFacilities(),
      inspections: this.api.getInspections(),
      complaints: this.api.getComplaints(),
    }).subscribe({
      next: ({ facilities, inspections, complaints }) => {
        this.facilities = facilities;
        this.inspections = inspections;
        this.openComplaints = complaints.filter(
          (complaint) => complaint.status === 'open' || complaint.status === 'in_progress',
        ).length;
        this.averageRating = inspections.length
          ? inspections.reduce((total, inspection) => total + inspection.rating, 0) / inspections.length
          : 0;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.apiErrors.message(error);
        this.loading = false;
      },
    });
  }
}
