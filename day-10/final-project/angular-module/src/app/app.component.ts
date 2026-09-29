import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InspectionApiService } from './inspection-api.service';
import type { InspectionRecord } from './inspection.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePipe, FormsModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly api = inject(InspectionApiService);
  inspections: InspectionRecord[] = [];
  statusFilter = 'all';
  loading = true;
  error = '';

  get visibleInspections(): InspectionRecord[] {
    return this.statusFilter === 'all'
      ? this.inspections
      : this.inspections.filter((inspection) => inspection.status === this.statusFilter);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getInspections().subscribe({
      next: (inspections) => {
        this.inspections = inspections;
        this.loading = false;
      },
      error: (cause: unknown) => {
        this.error = cause instanceof Error
          ? cause.message
          : 'Could not load inspections. Confirm the Node API and MySQL database are running.';
        this.loading = false;
      },
    });
  }
}
