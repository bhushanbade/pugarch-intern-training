export interface ApiResource<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface DepartmentSummary {
  id: number;
  name: string;
}

export interface Facility {
  id: number;
  department_id: number;
  name: string;
  category: string;
  location: string;
  condition_score: number;
  is_operational: boolean;
  notes: string | null;
  department: DepartmentSummary | null;
  created_at: string;
  updated_at: string;
}

export interface InspectionFacilitySummary {
  id: number;
  name: string;
}

export interface InspectorSummary {
  id: number;
  name: string;
}

export interface Inspection {
  id: number;
  facility_id: number;
  inspector_id: number | null;
  rating: number;
  inspected_at: string;
  findings: string;
  facility: InspectionFacilitySummary;
  inspector: InspectorSummary | null;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: number;
  facility_id: number;
  submitted_by: number | null;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  reported_at: string;
  facility: InspectionFacilitySummary;
}

export interface CreateInspectionRequest {
  facility_id: number;
  rating: number;
  inspected_at: string;
  findings: string;
}
