export type FacilityStatus = 'operational' | 'maintenance' | 'offline';
export type InspectionStatus = 'scheduled' | 'completed' | 'failed';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Department {
  id: number;
  name: string;
}

export interface UserSummary {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export interface Facility {
  id: number;
  department_id: number;
  name: string;
  category: string;
  location: string;
  condition_score: number;
  status: FacilityStatus;
  notes: string | null;
  department_name: string;
  inspections?: Inspection[];
  complaints?: Complaint[];
}

export interface Inspection {
  id: number;
  facility_id: number;
  inspector_id: number | null;
  rating: number | null;
  status: InspectionStatus;
  inspected_at: string;
  findings: string;
  facility_name: string;
  inspector_name: string | null;
}

export interface Complaint {
  id: number;
  facility_id: number;
  submitted_by: number | null;
  subject: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  reported_at: string;
  resolved_at: string | null;
  resolution_notes: string | null;
  facility_name: string;
}

export interface Employee {
  id: number;
  department_id: number;
  name: string;
  email: string;
  position: string;
  hired_on: string;
  department_name: string;
}

export interface DashboardStats {
  total_facilities: number;
  total_inspections: number;
  total_complaints: number;
  open_complaints: number;
  resolved_complaints: number;
  resolution_rate: number;
  facility_status: Record<FacilityStatus, number>;
  inspection_status: Record<InspectionStatus, number>;
  complaint_status: Record<ComplaintStatus, number>;
  recent_inspections: Inspection[];
  recent_complaints: Complaint[];
}

export interface FacilityPerformance {
  facility_id: number;
  facility_name: string;
  department_name: string;
  condition_score: number;
  status: FacilityStatus;
  inspection_count: number;
  average_rating: number | null;
  complaint_count: number;
  open_complaints: number;
  resolved_complaints: number;
  resolution_rate: number | null;
}

export type ResourceName = 'facilities' | 'inspections' | 'complaints' | 'employees';
