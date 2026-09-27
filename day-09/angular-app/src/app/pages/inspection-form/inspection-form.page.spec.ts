import { provideRouter, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FacilityApiService } from '../../core/services/facility-api.service';
import { Facility } from '../../core/models/api.models';
import { InspectionFormPage } from './inspection-form.page';

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

describe('InspectionFormPage', () => {
  let fixture: ComponentFixture<InspectionFormPage>;
  let api: jasmine.SpyObj<FacilityApiService>;
  let router: Router;

  beforeEach(async () => {
    api = jasmine.createSpyObj<FacilityApiService>('FacilityApiService', ['getFacilities', 'createInspection']);
    api.getFacilities.and.returnValue(of([facility]));
    api.createInspection.and.returnValue(of({
      id: 4,
      facility_id: 1,
      inspector_id: null,
      rating: 5,
      inspected_at: '2026-09-01',
      findings: 'All inspected areas are in good condition.',
      facility: { id: 1, name: 'Central Library' },
      inspector: null,
      created_at: '2026-09-01',
      updated_at: '2026-09-01',
    }));

    await TestBed.configureTestingModule({
      imports: [InspectionFormPage],
      providers: [provideRouter([{ path: 'inspections', component: InspectionFormPage }]), { provide: FacilityApiService, useValue: api }],
    }).compileComponents();
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(InspectionFormPage);
    fixture.detectChanges();
  });

  it('rejects missing and out-of-range required values', () => {
    expect(fixture.componentInstance.form.invalid).toBeTrue();
    fixture.componentInstance.form.setValue({
      facility_id: 1,
      rating: 4,
      inspected_at: '2026-09-01',
      findings: '   ',
    });
    expect(fixture.componentInstance.form.controls.findings.hasError('whitespace')).toBeTrue();

    fixture.componentInstance.form.setValue({
      facility_id: 1,
      rating: 6,
      inspected_at: '2026-09-01',
      findings: 'Inspection notes',
    });
    expect(fixture.componentInstance.form.controls.rating.hasError('max')).toBeTrue();
    expect(fixture.componentInstance.form.invalid).toBeTrue();
    expect(api.createInspection).not.toHaveBeenCalled();
  });

  it('submits a valid inspection using the Day 8 request fields', () => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture.componentInstance.form.setValue({
      facility_id: 1,
      rating: 5,
      inspected_at: '2026-09-01',
      findings: '  All inspected areas are in good condition.  ',
    });

    fixture.componentInstance.submit();

    expect(api.createInspection).toHaveBeenCalledWith({
      facility_id: 1,
      rating: 5,
      inspected_at: '2026-09-01',
      findings: '  All inspected areas are in good condition.  ',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/inspections'], { queryParams: { created: '1' } });
  });
});
