import axios from 'axios';
import type {
  Complaint,
  DashboardStats,
  Department,
  Employee,
  Facility,
  FacilityPerformance,
  Inspection,
  ResourceName,
  UserSummary,
} from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { Accept: 'application/json' },
  timeout: 10000,
});

export function friendlyError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.status === 0 || !error.response) return 'Cannot reach the server. Check that the API is running.';
    return `The request failed (${error.response.status}). Please try again.`;
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export const listRecords = async <T>(resource: ResourceName, params?: object): Promise<T[]> =>
  (await api.get<{ data: T[] }>(`/${resource}`, { params })).data.data;

export const getRecord = async <T>(resource: ResourceName, id: number): Promise<T> =>
  (await api.get<{ data: T }>(`/${resource}/${id}`)).data.data;

export const createRecord = async <T>(resource: ResourceName, payload: object): Promise<T> =>
  (await api.post<{ data: T }>(`/${resource}`, payload)).data.data;

export const updateRecord = async <T>(resource: ResourceName, id: number, payload: object): Promise<T> =>
  (await api.put<{ data: T }>(`/${resource}/${id}`, payload)).data.data;

export const deleteRecord = async (resource: ResourceName, id: number): Promise<void> => {
  await api.delete(`/${resource}/${id}`);
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const res = await api.get<{ data: DashboardStats }>('/dashboard/stats');
    return res.data.data;
  } catch {
    const res = await api.get<{ data: DashboardStats }>('/dashboard');
    return res.data.data;
  }
};
export const getPerformance = async (): Promise<FacilityPerformance[]> =>
  (await api.get<{ data: FacilityPerformance[] }>('/performance')).data.data;
export const getDepartments = async (): Promise<Department[]> =>
  (await api.get<{ data: Department[] }>('/departments')).data.data;
export const getUsers = async (): Promise<UserSummary[]> =>
  (await api.get<{ data: UserSummary[] }>('/users')).data.data;

export const listFacilities = (params?: object) => listRecords<Facility>('facilities', params);
export const listInspections = (params?: object) => listRecords<Inspection>('inspections', params);
export const listComplaints = (params?: object) => listRecords<Complaint>('complaints', params);
export const listEmployees = (params?: object) => listRecords<Employee>('employees', params);
