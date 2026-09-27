import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiErrorService } from '../../core/services/api-error.service';
import { FacilityApiService } from '../../core/services/facility-api.service';
import { Facility } from '../../core/models/api.models';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StateMessageComponent } from '../../shared/components/state-message/state-message.component';

const nonWhitespace: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  typeof control.value === 'string' && control.value.trim().length > 0 ? null : { whitespace: true };

@Component({
  selector: 'app-inspection-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeaderComponent, StateMessageComponent],
  templateUrl: './inspection-form.page.html',
  styleUrl: './inspection-form.page.scss',
})
export class InspectionFormPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(FacilityApiService);
  private readonly apiErrors = inject(ApiErrorService);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group({
    facility_id: [0, [Validators.required, Validators.min(1)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    inspected_at: [this.today(), Validators.required],
    findings: ['', [Validators.required, nonWhitespace, Validators.maxLength(16000)]],
  });
  facilities: Facility[] = [];
  facilitiesLoading = true;
  loadingError = '';
  saving = false;
  submitted = false;
  saveError = '';

  ngOnInit(): void {
    this.api.getFacilities().subscribe({
      next: (facilities) => {
        this.facilities = facilities;
        this.facilitiesLoading = false;
      },
      error: (error: unknown) => {
        this.loadingError = this.apiErrors.message(error);
        this.facilitiesLoading = false;
      },
    });
  }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted);
  }

  canLeave(): boolean {
    return !this.form.dirty || this.submitted || window.confirm('Discard this unsaved inspection?');
  }

  submit(): void {
    this.submitted = true;
    this.saveError = '';
    this.form.markAllAsTouched();
    if (this.form.invalid || this.facilitiesLoading || this.facilities.length === 0) {
      return;
    }

    this.saving = true;
    this.api.createInspection(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.form.markAsPristine();
        void this.router.navigate(['/inspections'], { queryParams: { created: '1' } });
      },
      error: (error: unknown) => {
        this.saveError = this.apiErrors.message(error);
        this.saving = false;
      },
    });
  }

  private today(): string {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    return localDate.toISOString().slice(0, 10);
  }
}
