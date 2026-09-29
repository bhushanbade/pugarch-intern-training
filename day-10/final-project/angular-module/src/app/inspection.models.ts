export interface FacilitySummary {
  id: number;
  name: string;
}

export interface FacilityRecord {
  id: number;
  name: string;
}

export interface InspectionRecord {
  id: number;
  facility_id: number;
  facility_name: string;
  inspector_name: string | null;
  inspected_at: string;
  status: 'scheduled' | 'completed' | 'failed';
  rating: number | null;
  findings: string;
}

export interface ApiData<T> {
  data: T;
}
