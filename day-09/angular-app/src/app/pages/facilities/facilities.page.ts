import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiErrorService } from '../../core/services/api-error.service';
import { FacilityApiService } from '../../core/services/facility-api.service';
import { Facility } from '../../core/models/api.models';
import { OperationalStatusDirective } from '../../shared/directives/operational-status.directive';
import { ConditionLabelPipe } from '../../shared/pipes/condition-label.pipe';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StateMessageComponent } from '../../shared/components/state-message/state-message.component';

@Component({
  selector: 'app-facilities-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    OperationalStatusDirective,
    ConditionLabelPipe,
    PageHeaderComponent,
    StateMessageComponent,
  ],
  templateUrl: './facilities.page.html',
  styleUrl: './facilities.page.scss',
})
export class FacilitiesPage implements OnInit {
  private readonly api = inject(FacilityApiService);
  private readonly apiErrors = inject(ApiErrorService);

  facilities: Facility[] = [];
  searchTerm = '';
  categoryFilter = '';
  operationalFilter = 'all';
  sortBy = 'name';
  loading = true;
  errorMessage = '';

  get categories(): string[] {
    return [...new Set(this.facilities.map((facility) => facility.category))].sort((a, b) =>
      a.localeCompare(b),
    );
  }

  get visibleFacilities(): Facility[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.facilities
      .filter((facility) => {
        const matchesSearch =
          !query ||
          [facility.name, facility.location, facility.category, facility.department?.name ?? '']
            .join(' ')
            .toLowerCase()
            .includes(query);
        const matchesCategory = !this.categoryFilter || facility.category === this.categoryFilter;
        const matchesStatus =
          this.operationalFilter === 'all' ||
          facility.is_operational === (this.operationalFilter === 'operational');
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (this.sortBy === 'condition-low') {
          return a.condition_score - b.condition_score || a.name.localeCompare(b.name);
        }
        if (this.sortBy === 'condition-high') {
          return b.condition_score - a.condition_score || a.name.localeCompare(b.name);
        }
        return a.name.localeCompare(b.name);
      });
  }

  ngOnInit(): void {
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.loading = true;
    this.errorMessage = '';
    this.api.getFacilities().subscribe({
      next: (facilities) => {
        this.facilities = facilities;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.apiErrors.message(error);
        this.loading = false;
      },
    });
  }
}
