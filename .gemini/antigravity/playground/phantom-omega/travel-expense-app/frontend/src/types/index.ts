export interface PermissionData {
    id?: string;
    timestamp?: string;
    ref_no: string;
    doc_date: string;
    subject: string;
    to_person: string;
    office: string;
    person_name: string;
    position: string;
    department: string;
    objective: string;
    destination: string;
    start_date: string;
    end_date: string;
    vehicle_type: 'Personal Car' | 'Public Transport' | 'Official Vehicle' | 'Other';
    license_plate?: string;
    province?: string;
    distance?: number;
    map_url_origin?: string;
    map_url_destination?: string;
    budget_source: string;
    status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    id?: string;
    url?: string;
}
