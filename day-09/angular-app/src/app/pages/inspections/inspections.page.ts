import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiErrorService } from '../../core/services/api-error.service';
import { FacilityApiService } from '../../core/services/facility-api.service';
import { Inspection } from '../../core/models/api.models';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StateMessageComponent } from '../../shared/components/state-message/state-message.component';

@Component({
  selector: 'app-inspections-page',
  standalone: true,
  imports: [DatePipe, RouterLink, PageHeaderComponent, StateMessageComponent],
  templateUrl: './inspections.page.html',
  styleUrl: './inspections.page.scss',
})
export class InspectionsPage implements OnInit {
  private readonly api = inject(FacilityApiService);
  private readonly apiErrors = inject(ApiErrorService);
  private readonly route = inject(ActivatedRoute);

  inspections: Inspection[] = [];
  loading = true;
  errorMessage = '';
  showCreatedMessage = false;

  ngOnInit(): void {
    this.showCreatedMessage = this.route.snapshot.queryParamMap.get('created') === '1';
    this.loadInspections();
  }

  loadInspections(): void {
    this.loading = true;
    this.errorMessage = '';
    this.api.getInspections().subscribe({
      next: (inspections) => {
        this.inspections = [...inspections].sort((a, b) =>
          b.inspected_at.localeCompare(a.inspected_at),
        );
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.apiErrors.message(error);
        this.loading = false;
      },
    });
  }
}
